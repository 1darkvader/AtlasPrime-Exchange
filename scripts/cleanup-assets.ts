import prisma from '../src/lib/prisma';

/**
 * Cleanup script to fix malformed asset names
 * Fixes issues like "BTC/" -> "BTC", removes trailing slashes and whitespace
 */
async function cleanupAssets() {
  console.log('🧹 Starting asset cleanup...\n');

  try {
    // Find all wallets with problematic asset names
    const allWallets = await prisma.wallet.findMany();
    const adminWallets = await prisma.adminWallet.findMany();

    let fixed = 0;
    let merged = 0;

    // Fix user wallets
    for (const wallet of allWallets) {
      const cleanAsset = wallet.asset.replace(/\//g, '').trim().toUpperCase();

      if (cleanAsset !== wallet.asset) {
        console.log(`\n🔧 Fixing wallet: "${wallet.asset}" → "${cleanAsset}"`);
        console.log(`   User ID: ${wallet.userId}`);
        console.log(`   Balance: ${wallet.balance}`);

        // Check if clean asset already exists
        const existingWallet = await prisma.wallet.findUnique({
          where: {
            userId_asset: {
              userId: wallet.userId,
              asset: cleanAsset
            }
          }
        });

        if (existingWallet) {
          // Merge balances
          console.log(`   ⚠️  Merging with existing ${cleanAsset} wallet`);
          await prisma.wallet.update({
            where: {
              userId_asset: {
                userId: wallet.userId,
                asset: cleanAsset
              }
            },
            data: {
              balance: {
                increment: wallet.balance
              },
              lockedBalance: {
                increment: wallet.lockedBalance
              }
            }
          });

          // Delete the old wallet
          await prisma.wallet.delete({
            where: {
              userId_asset: {
                userId: wallet.userId,
                asset: wallet.asset
              }
            }
          });

          merged++;
          console.log(`   ✅ Merged and deleted old wallet`);
        } else {
          // Just rename the asset
          await prisma.wallet.update({
            where: {
              userId_asset: {
                userId: wallet.userId,
                asset: wallet.asset
              }
            },
            data: {
              asset: cleanAsset
            }
          });

          fixed++;
          console.log(`   ✅ Renamed to ${cleanAsset}`);
        }
      }
    }

    // Fix admin wallets
    for (const wallet of adminWallets) {
      const cleanAsset = wallet.asset.replace(/\//g, '').trim().toUpperCase();

      if (cleanAsset !== wallet.asset) {
        console.log(`\n🔧 Fixing admin wallet: "${wallet.asset}" → "${cleanAsset}"`);
        console.log(`   Balance: ${wallet.balance}`);

        // Check if clean asset already exists
        const existingWallet = await prisma.adminWallet.findUnique({
          where: {
            asset: cleanAsset
          }
        });

        if (existingWallet) {
          // Merge balances
          console.log(`   ⚠️  Merging with existing ${cleanAsset} admin wallet`);
          await prisma.adminWallet.update({
            where: {
              asset: cleanAsset
            },
            data: {
              balance: {
                increment: wallet.balance
              },
              totalDeposits: {
                increment: wallet.totalDeposits
              },
              totalWithdrawals: {
                increment: wallet.totalWithdrawals
              }
            }
          });

          // Delete the old wallet
          await prisma.adminWallet.delete({
            where: {
              asset: wallet.asset
            }
          });

          merged++;
          console.log(`   ✅ Merged and deleted old admin wallet`);
        } else {
          // Just rename the asset
          await prisma.adminWallet.update({
            where: {
              asset: wallet.asset
            },
            data: {
              asset: cleanAsset
            }
          });

          fixed++;
          console.log(`   ✅ Renamed to ${cleanAsset}`);
        }
      }
    }

    console.log(`\n\n✅ Cleanup complete!`);
    console.log(`   ${fixed} assets renamed`);
    console.log(`   ${merged} assets merged`);
    console.log(`   Total processed: ${fixed + merged}`);

    if (fixed === 0 && merged === 0) {
      console.log(`   ℹ️  No issues found - database is clean!`);
    }

  } catch (error) {
    console.error('\n❌ Cleanup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupAssets()
  .then(() => {
    console.log('\n🎉 Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
