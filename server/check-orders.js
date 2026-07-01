import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkOrders() {
  console.log("=== Checking Orders in Database ===\n");
  
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`Total orders found: ${orders.length}\n`);
    
    if (orders.length > 0) {
      orders.forEach((order, index) => {
        console.log(`${index + 1}. Order ID: ${order.id}`);
        console.log(`   User: ${order.userName} (ID: ${order.userId})`);
        console.log(`   Product: ${order.productName} (ID: ${order.productId})`);
        console.log(`   Qty: ${order.qty}, Total: ₹${order.total}`);
        console.log(`   Status: ${order.status}, Payment: ${order.paymentStatus}`);
        console.log(`   Date: ${order.date}`);
        console.log(`   Distributor: ${order.distributor}`);
        console.log('');
      });
    } else {
      console.log("No orders found in database!");
      console.log("\nThis means orders are not being saved to the database.");
      console.log("Check the following:");
      console.log("1. Is the server running?");
      console.log("2. Is the user logged in when placing order?");
      console.log("3. Is the token being sent in the request?");
    }
    
  } catch (error) {
    console.error("Error checking orders:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrders();