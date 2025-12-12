import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await getAuthUserId(ctx);
    const payments = await ctx.db.query("payments").collect();
    const paymentsWithDetails = await Promise.all(
      payments.map(async (payment) => {
        const tenant = await ctx.db.get(payment.tenantId);
        const lease = await ctx.db.get(payment.leaseId);
        return { ...payment, tenant, lease };
      })
    );
    return paymentsWithDetails;
  },
});

export const getByTenant = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, args) => {
    await getAuthUserId(ctx);
    return await ctx.db
      .query("payments")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .collect();
  },
});

export const create = mutation({
  args: {
    tenantId: v.id("tenants"),
    leaseId: v.id("leases"),
    amount: v.number(),
    dueDate: v.string(),
    type: v.union(v.literal("rent"), v.literal("deposit"), v.literal("fee")),
  },
  handler: async (ctx, args) => {
    await getAuthUserId(ctx);
    return await ctx.db.insert("payments", {
      ...args,
      status: "pending",
    });
  },
});

export const markPaid = mutation({
  args: {
    id: v.id("payments"),
    paymentMethod: v.string(),
    transactionId: v.string(),
  },
  handler: async (ctx, args) => {
    await getAuthUserId(ctx);
    return await ctx.db.patch(args.id, {
      status: "paid",
      paidDate: new Date().toISOString().split('T')[0],
      paymentMethod: args.paymentMethod,
      transactionId: args.transactionId,
    });
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    await getAuthUserId(ctx);
    const payments = await ctx.db.query("payments").collect();
    const paidPayments = payments.filter(p => p.status === "paid");
    const pendingPayments = payments.filter(p => p.status === "pending");
    const overduePayments = payments.filter(p => p.status === "overdue");
    
    const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalPayments: payments.length,
      paid: paidPayments.length,
      pending: pendingPayments.length,
      overdue: overduePayments.length,
      totalRevenue,
      pendingAmount,
    };
  },
});
