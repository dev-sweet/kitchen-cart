import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/helpers";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { fullName, line1, line2, city, state, zip, country, phone, isDefault } = body;

    const existing = await db.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (isDefault) {
      await db.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await db.address.update({
      where: { id },
      data: {
        ...(fullName && { fullName }),
        ...(line1 && { line1 }),
        ...(line2 !== undefined && { line2: line2 || null }),
        ...(city && { city }),
        ...(state && { state }),
        ...(zip && { zip }),
        ...(country && { country }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(isDefault !== undefined && { isDefault }),
      },
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await db.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await db.address.delete({ where: { id } });

    if (existing.isDefault) {
      const firstAddress = await db.address.findFirst({
        where: { userId: user.id },
      });
      if (firstAddress) {
        await db.address.update({
          where: { id: firstAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ message: "Address deleted" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
