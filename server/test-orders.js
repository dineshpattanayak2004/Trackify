import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testOrders() {
  console.log("=== Testing Orders System ===\n");

  try {
    // Check if orders exist
    const orderCount = await prisma.order.count();
    console.log("Total orders in database:", orderCount);

    if (orderCount > 0) {
      const orders = await prisma.order.findMany({
        include: {
          product: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      console.log("\nOrders found:");
      orders.forEach((order, i) => {
        console.log(`\n${i + 1}. Order ID: ${order.id}`);
        console.log(`   User: ${order.userName} (${order.user?.email || "no email"})`);
        console.log(`   Product: ${order.productName}`);
        console.log(`   Qty: ${order.qty}, Total: ₹${order.total}`);
        console.log(`   Status: ${order.status}, Payment: ${order.paymentStatus}`);
        console.log(`   Date: ${order.date}`);
        console.log(`   Distributor: ${order.distributor}`);
      });
    } else {
      console.log("No orders found in database");
      console.log("\nLet's create a test order...");

      // Get first user and product
      const users = await prisma.user.findMany();
      const products = await prisma.product.findMany();

      if (users.length > 0 && products.length > 0) {
        const testOrder = await prisma.order.create({
          data: {
            userId: users[0].id,
            userName: users[0].name || "Test User",
            productId: products[0].id,
            productName: products[0].name,
            qty: 1,
            total: products[0].price,
            paymentMethod: "UPI",
            paymentStatus: "paid",
            date: new Date().toISOString().split("T")[0],
            distributor: "TechDistro Pvt Ltd",
            status: "pending",
            distributorId: "test-distributor-id",
          },
          include: {
            product: true,
            user: true,
          },
        });

        console.log("\n✓ Test order created successfully!");
        console.log(`  Order ID: ${testOrder.id}`);
        console.log(`  User: ${testOrder.userName}`);
        console.log(`  Product: ${testOrder.productName}`);
        console.log(`  Total: ₹${testOrder.total}`);
      } else {
        console.log("⚠ No users or products found to create test order");
      }
    }

    console.log("\n=== Test Complete ===");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testOrders();