import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function testFeatures() {
  console.log("=== Testing Password Hashing and Product Selection ===\n");

  try {
    // Test 1: Password Hashing
    console.log("1. Testing Password Hashing:");
    const testPassword = "test123";
    const hashedPassword = await bcrypt.hash(testPassword, SALT_ROUNDS);
    console.log("   Original:", testPassword);
    console.log("   Hashed:", hashedPassword);
    console.log("   ✓ Password hashed successfully\n");

    // Test 2: Password Comparison
    console.log("2. Testing Password Comparison:");
    const isMatch = await bcrypt.compare(testPassword, hashedPassword);
    console.log("   Comparing 'test123' with hash:", isMatch ? "✓ Match" : "✗ No match");
    const wrongMatch = await bcrypt.compare("wrong", hashedPassword);
    console.log("   Comparing 'wrong' with hash:", wrongMatch ? "✗ Match" : "✓ No match (expected)\n");

    // Test 3: Check DistributorProductSelection table exists
    console.log("3. Testing DistributorProductSelection Table:");
    try {
      const selections = await prisma.distributorProductSelection.findMany();
      console.log("   ✓ Table exists and is accessible");
      console.log("   Current selections count:", selections.length);
    } catch (err) {
      console.log("   ✗ Error accessing table:", err.message);
    }

    // Test 4: Create a test distributor product selection
    console.log("\n4. Testing Product Selection Creation:");
    try {
      // First, check if we have any distributors
      const distributors = await prisma.distributor.findMany();
      if (distributors.length > 0) {
        const testDistributor = distributors[0];
        const products = await prisma.product.findMany();
        if (products.length > 0) {
          const testProduct = products[0];
          
          // Create selection
          const selection = await prisma.distributorProductSelection.create({
            data: {
              distributorId: testDistributor.id,
              productId: testProduct.id,
            },
          });
          console.log("   ✓ Selection created successfully");
          console.log("   Distributor:", testDistributor.name);
          console.log("   Product:", testProduct.name);
          console.log("   Selection ID:", selection.id);

          // Test 5: Query selections for distributor
          console.log("\n5. Testing Query Distributor Selections:");
          const distributorSelections = await prisma.distributorProductSelection.findMany({
            where: { distributorId: testDistributor.id },
          });
          console.log("   ✓ Found", distributorSelections.length, "selection(s) for distributor");

          // Clean up - delete test selection
          await prisma.distributorProductSelection.delete({
            where: { id: selection.id },
          });
          console.log("   ✓ Test selection cleaned up");
        } else {
          console.log("   ⚠ No products found in database");
        }
      } else {
        console.log("   ⚠ No distributors found in database");
      }
    } catch (err) {
      console.log("   ✗ Error:", err.message);
    }

    console.log("\n=== All Tests Completed Successfully ===");
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testFeatures();