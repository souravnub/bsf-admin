import { Course } from "@/app/lib/models/Course";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connectToDB();

        const uniqueJobOpportunities = await Course.aggregate([
            { $unwind: "$jobOpportunities" }, // Unwind the job opportunities array
            { $group: { _id: "$jobOpportunities" } }, // Group by job opportunities
            { $project: { _id: 0, jobOpportunity: "$_id" } }, // Project to rename field
        ]);

        const jobOpportunitiesArray = uniqueJobOpportunities.map(
            (job) => job.jobOpportunity
        );

        return NextResponse.json(jobOpportunitiesArray);
    } catch (error) {
        return NextResponse.json(
            {
                errorMessage: "Error while fetching job opportunities",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
