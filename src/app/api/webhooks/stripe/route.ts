import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    
    // Retrieve the appointment ID from the metadata
    const appointmentId = session.metadata?.appointmentId;

    if (appointmentId) {
      // Mark the appointment as CONFIRMED
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: "CONFIRMED" }
      });
      console.log(`Appointment ${appointmentId} confirmed via Stripe webhook.`);
    }
  }

  return NextResponse.json({ received: true });
}
