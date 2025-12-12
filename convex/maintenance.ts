import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await getAuthUserId(ctx);
    const requests = await ctx.db.query("maintenanceRequests").collect();
    const requestsWithTenants = await Promise.all(
      requests.map(async (request) => {
        const tenant = await ctx.db.get(request.tenantId);
        return { ...request, tenant };
      })
    );
    return requestsWithTenants;
  },
});

export const getByTenant = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, args) => {
    await getAuthUserId(ctx);
    return await ctx.db
      .query("maintenanceRequests")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .collect();
  },
});

export const create = mutation({
  args: {
    tenantId: v.id("tenants"),
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("plumbing"),
      v.literal("electrical"),
      v.literal("heating"),
      v.literal("appliances"),
      v.literal("other")
    ),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
  },
  handler: async (ctx, args) => {
    await getAuthUserId(ctx);
    return await ctx.db.insert("maintenanceRequests", {
      ...args,
      status: "open",
      submittedDate: new Date().toISOString().split('T')[0],
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("maintenanceRequests"),
    status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("completed"), v.literal("cancelled")),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getAuthUserId(ctx);
    const updates: any = { status: args.status };
    
    if (args.assignedTo !== undefined) {
      updates.assignedTo = args.assignedTo;
    }
    
    if (args.status === "completed") {
      updates.completedDate = new Date().toISOString().split('T')[0];
    }
    
    return await ctx.db.patch(args.id, updates);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    await getAuthUserId(ctx);
    const requests = await ctx.db.query("maintenanceRequests").collect();
    const openRequests = requests.filter(r => r.status === "open").length;
    const inProgressRequests = requests.filter(r => r.status === "in_progress").length;
    const completedRequests = requests.filter(r => r.status === "completed").length;
    const urgentRequests = requests.filter(r => r.priority === "urgent" && r.status !== "completed").length;
    
    return {
      total: requests.length,
      open: openRequests,
      inProgress: inProgressRequests,
      completed: completedRequests,
      urgent: urgentRequests,
    };
  },
});
