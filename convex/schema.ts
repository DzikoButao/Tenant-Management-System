import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  tenants: defineTable({
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
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")),
    profileImage: v.optional(v.id("_storage")),
  })
    .index("by_email", ["email"])
    .index("by_student_id", ["studentId"])
    .index("by_status", ["status"]),

  leases: defineTable({
    tenantId: v.id("tenants"),
    propertyAddress: v.string(),
    roomNumber: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    monthlyRent: v.number(),
    securityDeposit: v.number(),
    status: v.union(v.literal("active"), v.literal("expired"), v.literal("terminated")),
    leaseDocument: v.optional(v.id("_storage")),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_status", ["status"])
    .index("by_property", ["propertyAddress"]),

  payments: defineTable({
    tenantId: v.id("tenants"),
    leaseId: v.id("leases"),
    amount: v.number(),
    dueDate: v.string(),
    paidDate: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("overdue")),
    paymentMethod: v.optional(v.string()),
    transactionId: v.optional(v.string()),
    type: v.union(v.literal("rent"), v.literal("deposit"), v.literal("fee")),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_lease", ["leaseId"])
    .index("by_status", ["status"])
    .index("by_due_date", ["dueDate"]),

  maintenanceRequests: defineTable({
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
    status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("completed"), v.literal("cancelled")),
    submittedDate: v.string(),
    completedDate: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    images: v.optional(v.array(v.id("_storage"))),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_category", ["category"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
