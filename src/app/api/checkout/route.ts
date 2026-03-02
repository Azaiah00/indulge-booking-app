import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { parse, addMinutes } from "date-fns";

export async function POST(req: Request) {
  try {
    const { serviceId, date, time, userId } = await req.json();

    // 1. Fetch service details from DB
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const serviceName = service.name;
    const servicePrice = Math.round(Number(service.price) * 100); // convert to cents
    
    const parsedTime = parse(time, "h:mm a", new Date(date));
    const startTime = parsedTime;
    const endTime = addMinutes(parsedTime, service.duration);

    // Get an actual user ID if passed, or default to a system placeholder or error
    // For demo: create or find a dummy user if none provided
    let realUserId = userId;
    if (userId === "anonymous") {
      const dummyUser = await prisma.user.upsert({
        where: { email: "guest@example.com" },
        update: {},
        create: { email: "guest@example.com", name: "Guest User" }
      });
      realUserId = dummyUser.id;
    }

    // 2. Create an initial PENDING appointment in the database
    const appointment = await prisma.appointment.create({
      data: {
        serviceId: service.id,
        userId: realUserId,
        startTime,
        endTime,
        status: "PENDING",
      }
    });

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: serviceName,
              description: `Appointment on ${date} at ${time}`,
            },
            unit_amount: servicePrice,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/portal?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/book?canceled=true`,
      client_reference_id: appointment.id,
      metadata: {
        appointmentId: appointment.id,
      }
    });

    // 4. Update appointment with Stripe Session ID for tracking
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { stripeId: session.id }
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
