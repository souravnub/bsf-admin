import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";
import { Course } from "@/app/lib/models/Course";
import { CourseCategory } from "@/app/lib/models/CourseCategory";

export async function GET(request) {
    try {
        const page = request.nextUrl.searchParams.get(["page"]) || 1;
        const sortBy = request.nextUrl.searchParams.get(["sortBy"]);
        const category = request.nextUrl.searchParams.get(["category"]);
        const jobs = request.nextUrl.searchParams.get(["jobs"]);
        const withPagination = request.nextUrl.searchParams.get([
            "withPagination",
        ]);

        connectToDB();
        const ITEM_PER_PAGE = 9;
        let query = Course.find({ isVisibleToCustomers: true })
            .select(
                "name price description image category background textColor schedule isActive"
            )
            .populate("category")
            .sort({ isActive: -1 });

        if (withPagination === "false") {
            const courses = await Course.find({ isVisibleToCustomers: true });

            return NextResponse.json({
                courses,
            });
        }

        let countQuery = Course.find({ isVisibleToCustomers: true });

        switch (sortBy) {
            case "latest":
                query = query.sort({ createdAt: -1 });
                break;
            case "low":
                query = query.sort({ price: 1 });
                break;
            case "high":
                query = query.sort({ price: -1 });
                break;
            default:
                query = query.sort({ createdAt: -1 });
                break;
        }

        // Apply pagination
        query = query.limit(ITEM_PER_PAGE).skip(ITEM_PER_PAGE * (page - 1));
        countQuery = countQuery.countDocuments({ isVisibleToCustomers: true });

        if (category) {
            const categories = category.split(","); // Split categories by comma

            // Find the category IDs matching any of the categories in the list
            const categoryIDs = await CourseCategory.find({
                category: { $in: categories },
            }).distinct("_id");

            if (categoryIDs && categoryIDs.length > 0) {
                query = query
                    .find({
                        category: { $in: categoryIDs },
                        isVisibleToCustomers: true,
                    })
                    .select("name price description image category")
                    .populate("category");
                countQuery = countQuery
                    .find({
                        category: { $in: categoryIDs },
                        isVisibleToCustomers: true,
                    })
                    .select("name price description image category")
                    .populate("category");
            }
        }

        if (jobs) {
            const jobOpportunities = jobs.split(","); // Split job opportunities by comma

            // Find courses where jobOpportunities array contains any of the provided jobs
            query = query
                .find({
                    jobOpportunities: { $in: jobOpportunities },
                    isVisibleToCustomers: true,
                })
                .select("name price description image category")
                .populate("category");
            countQuery = countQuery
                .find({
                    jobOpportunities: { $in: jobOpportunities },
                    isVisibleToCustomers: true,
                })
                .select("name price description image category")
                .populate("category");
        }

        const [count, courses] = await Promise.all([
            countQuery.exec(),
            query.exec(),
        ]);

        return NextResponse.json({ count, courses });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                errorMessage: "Error while fetching courses",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
