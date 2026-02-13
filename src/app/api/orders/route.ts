import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const CreateOrderSchema = z.object({
  userEmail: z.string().email(),
  items: z
    .array(
      z.object({
        productSlug: z.string().min(1),
        quantity: z.number().int().positive()
      })
    )
    .min(1)
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = CreateOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { userEmail, items } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) {
    return NextResponse.json({ error: "Unknown user" }, { status: 404 });
  }

  const products = await prisma.product.findMany({
    where: { slug: { in: items.map((i) => i.productSlug) }, active: true }
  });

  if (products.length !== items.length) {
    return NextResponse.json({ error: "One or more products are invalid" }, { status: 400 });
  }

  const itemRows = items.map((item) => {
    const product = products.find((p) => p.slug === item.productSlug)!;
    return {
      productId: product.id,
      quantity: item.quantity,
      unitCents: product.priceCents,
      totalCents: product.priceCents * item.quantity
    };
  });

  const totalCents = itemRows.reduce((acc, row) => acc + row.totalCents, 0);

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalCents,
      items: {
        create: itemRows
      },
      payment: {
        create: {
          amountCents: totalCents
        }
      }
    },
    include: { items: true, payment: true }
  });

  return NextResponse.json(order, { status: 201 });
}
