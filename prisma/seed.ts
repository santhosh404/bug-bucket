import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Seeding database...")

    // Create demo users
    const ownerPassword = await bcrypt.hash("password123", 10)
    const memberPassword = await bcrypt.hash("password123", 10)

    const owner = await prisma.user.upsert({
        where: { email: "owner@bugbucket.dev" },
        update: {},
        create: {
            email: "owner@bugbucket.dev",
            name: "Demo Owner",
            password: ownerPassword,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=owner",
        },
    })

    const member1 = await prisma.user.upsert({
        where: { email: "alice@bugbucket.dev" },
        update: {},
        create: {
            email: "alice@bugbucket.dev",
            name: "Alice Developer",
            password: memberPassword,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
        },
    })

    const member2 = await prisma.user.upsert({
        where: { email: "bob@bugbucket.dev" },
        update: {},
        create: {
            email: "bob@bugbucket.dev",
            name: "Bob Engineer",
            password: memberPassword,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
        },
    })

    const member3 = await prisma.user.upsert({
        where: { email: "charlie@bugbucket.dev" },
        update: {},
        create: {
            email: "charlie@bugbucket.dev",
            name: "Charlie QA",
            password: memberPassword,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie",
        },
    })

    console.log("✅ Created demo users")

    // Create demo project
    const project = await prisma.project.create({
        data: {
            name: "Bug Bucket Demo Project",
            description: "A demonstration project showing Bug Bucket's capabilities. This project contains sample bugs, groups, and workflows to help you get started.",
            visibility: "PRIVATE",
            ownerId: owner.id,
            members: {
                create: [
                    { userId: owner.id, role: "OWNER" },
                    { userId: member1.id, role: "MEMBER" },
                    { userId: member2.id, role: "MEMBER" },
                    { userId: member3.id, role: "MEMBER" },
                ],
            },
        },
    })

    console.log("✅ Created demo project")

    // Create bug groups
    const group1 = await prisma.bugGroup.create({
        data: {
            name: "V1.0 Launch Bugs",
            description: "Critical bugs that must be fixed before V1.0 launch",
            projectId: project.id,
            order: 1,
        },
    })

    const group2 = await prisma.bugGroup.create({
        data: {
            name: "UI/UX Issues",
            description: "User interface and experience improvements",
            projectId: project.id,
            order: 2,
        },
    })

    const group3 = await prisma.bugGroup.create({
        data: {
            name: "Performance Optimization",
            description: "Performance-related bugs and optimizations",
            projectId: project.id,
            order: 3,
        },
    })

    const group4 = await prisma.bugGroup.create({
        data: {
            name: "Documentation",
            description: "Documentation improvements and fixes",
            projectId: project.id,
            order: 4,
        },
    })

    console.log("✅ Created bug groups")

    // Create sample bugs
    const bugs = [
        {
            title: "Login page doesn't redirect after successful authentication",
            description: "When users successfully log in, they remain on the login page instead of being redirected to the dashboard. This is a critical UX issue affecting all users.",
            status: "IN_PROGRESS" as const,
            priority: "CRITICAL" as const,
            bugGroupId: group1.id,
            assignedToId: member1.id,
            deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        },
        {
            title: "Dark mode toggle not persisting across sessions",
            description: "The dark mode preference is not being saved. Users have to toggle it every time they visit the site.",
            status: "OPEN" as const,
            priority: "HIGH" as const,
            bugGroupId: group2.id,
            assignedToId: member2.id,
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        },
        {
            title: "Project dashboard loads slowly with many bugs",
            description: "When a project has more than 100 bugs, the dashboard takes 5+ seconds to load. We need to implement pagination or lazy loading.",
            status: "BLOCKED" as const,
            priority: "HIGH" as const,
            bugGroupId: group3.id,
            assignedToId: member1.id,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
        {
            title: "API documentation missing for bug comments endpoint",
            description: "The /api/bugs/[id]/comments endpoint is not documented in our API docs. Need to add request/response examples.",
            status: "OPEN" as const,
            priority: "MEDIUM" as const,
            bugGroupId: group4.id,
            assignedToId: member3.id,
            deadline: null,
        },
        {
            title: "Mobile menu doesn't close after navigation",
            description: "On mobile devices, when users click a navigation item, the menu stays open instead of closing automatically.",
            status: "RESOLVED" as const,
            priority: "MEDIUM" as const,
            bugGroupId: group2.id,
            assignedToId: member2.id,
            deadline: null,
        },
        {
            title: "Email notifications not being sent",
            description: "Users are not receiving email notifications for bug assignments and comments. SMTP configuration appears correct.",
            status: "OPEN" as const,
            priority: "HIGH" as const,
            bugGroupId: group1.id,
            assignedToId: member1.id,
            deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        },
        {
            title: "File upload fails for files larger than 5MB",
            description: "Attempting to upload files larger than 5MB results in a timeout error. Need to increase the limit or implement chunked uploads.",
            status: "IN_PROGRESS" as const,
            priority: "MEDIUM" as const,
            bugGroupId: group1.id,
            assignedToId: member2.id,
            deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        },
        {
            title: "Search functionality not working for bug descriptions",
            description: "The search only looks at bug titles, not descriptions. Users expect full-text search across all bug content.",
            status: "OPEN" as const,
            priority: "LOW" as const,
            bugGroupId: group2.id,
            assignedToId: null,
            deadline: null,
        },
        {
            title: "Add keyboard shortcuts for common actions",
            description: "Implement keyboard shortcuts like 'C' for create bug, '/' for search, etc. to improve power user experience.",
            status: "OPEN" as const,
            priority: "LOW" as const,
            bugGroupId: group2.id,
            assignedToId: null,
            deadline: null,
        },
        {
            title: "Database query optimization for bug listing",
            description: "The bug listing query is doing N+1 queries for assignees. Need to add proper includes to optimize.",
            status: "CLOSED" as const,
            priority: "MEDIUM" as const,
            bugGroupId: group3.id,
            assignedToId: member1.id,
            deadline: null,
        },
    ]

    for (const bugData of bugs) {
        const bug = await prisma.bug.create({
            data: {
                ...bugData,
                projectId: project.id,
                createdById: owner.id,
            },
        })

        // Add some comments to bugs
        if (Math.random() > 0.5) {
            await prisma.bugComment.create({
                data: {
                    content: "I'm looking into this issue now. Will update soon with my findings.",
                    bugId: bug.id,
                    userId: bugData.assignedToId || member1.id,
                },
            })
        }

        // Create activity log
        await prisma.activityLog.create({
            data: {
                action: "created",
                entityType: "bug",
                entityId: bug.id,
                projectId: project.id,
                bugId: bug.id,
                userId: owner.id,
                metadata: {
                    bugTitle: bug.title,
                    priority: bug.priority,
                },
            },
        })
    }

    console.log("✅ Created sample bugs with comments")

    // Create some notifications
    await prisma.notification.create({
        data: {
            type: "BUG_ASSIGNED",
            title: "Bug assigned to you",
            message: "You have been assigned to bug: Login page doesn't redirect after successful authentication",
            userId: member1.id,
            projectId: project.id,
            read: false,
        },
    })

    await prisma.notification.create({
        data: {
            type: "PROJECT_MEMBER_ADDED",
            title: "Added to project",
            message: "You have been added to Bug Bucket Demo Project",
            userId: member2.id,
            projectId: project.id,
            read: true,
        },
    })

    console.log("✅ Created sample notifications")

    console.log("\n🎉 Seeding completed successfully!")
    console.log("\n📝 Demo credentials:")
    console.log("   Owner: owner@bugbucket.dev / password123")
    console.log("   Member 1: alice@bugbucket.dev / password123")
    console.log("   Member 2: bob@bugbucket.dev / password123")
    console.log("   Member 3: charlie@bugbucket.dev / password123")
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
