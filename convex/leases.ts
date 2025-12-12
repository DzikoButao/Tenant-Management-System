import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await getAuthUserId(ctx);
    const leases = await ctx.db.query("leases").collect();
    const leasesWithTenants = await Promise.all(
      leases.map(async (lease) => {
        const tenant = await ctx.db.get(lease.tenantId);
        return { ...lease, tenant };
      })
    );
    return leasesWithTenants;
  },
});

export const getByTenant = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, args) => {
    await getAuthUserId(ctx);
    return await ctx.db
      .query("leases")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .collect();
  },
});

export const create = mutation({
  args: {
    tenantId: v.id("tenants"),
    propertyAddress: v.string(),
    roomNumber: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    monthlyRent: v.number(),
    securityDeposit: v.number(),
  },
  handler: async (ctx, args) => {
    await getAuthUserId(ctx);
    return await ctx.db.insert("leases", {
      ...args,
      status: "active",
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("leases"),
    propertyAddress: v.optional(v.string()),
    roomNumber: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    monthlyRent: v.optional(v.number()),
    securityDeposit: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("expired"), v.literal("terminated"))),
  },
  handler: async (ctx, args) => {
    await getAuthUserId(ctx);
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    return await ctx.db.patch(id, filteredUpdates);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    await getAuthUserId(ctx);
    const leases = await ctx.db.query("leases").collect();
    const activeLeases = leases.filter(l => l.status === "active").length;
    const expiredLeases = leases.filter(l => l.status === "expired").length;
    const totalLeases = leases.length;
    
    return {
      total: totalLeases,
      active: activeLeases,
      expired: expiredLeases,
      terminated: totalLeases - activeLeases - expiredLeases,
    };
  },
});
