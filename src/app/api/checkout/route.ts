import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { parse, addMinutes } from "date-fns";
import { stripe } from "@/lib/stripe";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { serviceId, date, time, guestName, guestPhone } = await req.json();
    const session = await getServerSession(authOptions);

    const name = (guestName ?? "").toString().trim();
    const phone = (guestPhone ?? "").toString().trim();

    // Every booking needs contact info so the salon can reach the client.
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone number are required." },
        { status: 400 }
      );
    }

    // 1. Fetch service details from DB
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const serviceName = service.name;
    const servicePrice = Math.round(Number(service.price) * 100); // convert to cents

    const parsedTime = parse(time, "h:mm a", new Date(date));
    const startTime = parsedTime;
    const endTime = addMinutes(parsedTime, service.duration);

    // 2. Create a PENDING appointment.
    // Members: link to userId. Guests: store contact info on the appointment.
    const appointment = await prisma.appointment.create({
      data: {
        serviceId: service.id,
        userId: session?.user ? (session.user as any).id : null,
        guestName: name,
        guestPhone: phone,
        guestEmail: session?.user?.email ?? null,
        startTime,
        endTime,
        status: "PENDING",
      },
    });

    // 3. Create Stripe Checkout Session
    const sessionCheckout = await stripe.checkout.sessions.create({
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/portal?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/book?canceled=true`,
      client_reference_id: appointment.id,
      metadata: {
        appointmentId: appointment.id,
      },
    });

    // 4. Update appointment with Stripe Session ID for tracking
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { stripeId: sessionCheckout.id },
    });

    return NextResponse.json({ sessionId: sessionCheckout.id, url: sessionCheckout.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
