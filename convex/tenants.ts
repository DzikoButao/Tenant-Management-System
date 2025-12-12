import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await getAuthUserId(ctx);
    return await ctx.db.query("tenants").collect();
  },
});

export const get = query({
  args: { id: v.id("tenants") },
  handler: async (ctx, args) => {
    await getAuthUserId(ctx);
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    studentId: v.string(),
    university: v.string(),
    emergencyContact: v.object({
      name: v.string(),
      phone: v.string(),
      relationship: v.string(),
    }),
    moveInDate: v.string(),
  },
  handler: async (ctx, args) => {
    await getAuthUserId(ctx);
    return await ctx.db.insert("tenants", {
      ...args,
      status: "pending",
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tenants"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    studentId: v.optional(v.string()),
    university: v.optional(v.string()),
    emergencyContact: v.optional(v.object({
      name: v.string(),
      phone: v.string(),
      relationship: v.string(),
    })),
    moveInDate: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("pending"))),
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

export const remove = mutation({
  args: { id: v.id("tenants") },
  handler: async (ctx, args) => {
    await getAuthUserId(ctx);
    return await ctx.db.delete(args.id);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    await getAuthUserId(ctx);
    const tenants = await ctx.db.query("tenants").collect();
    const activeTenants = tenants.filter(t => t.status === "active").length;
    const pendingTenants = tenants.filter(t => t.status === "pending").length;
    const totalTenants = tenants.length;
    
    return {
      total: totalTenants,
      active: activeTenants,
      pending: pendingTenants,
      inactive: totalTenants - activeTenants - pendingTenants,
    };
  },
});
