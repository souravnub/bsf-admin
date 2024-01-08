"use client";
import { setReviewVisibility } from "@/app/lib/actions";
import { useEffect, useState } from "react";

const SyncedCheckbox = ({ initialVal = false, reviewId }) => {
    const [isChecked, setIsChecked] = useState(initialVal);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const toggle = async () => {
            setIsLoading(true);
            await setReviewVisibility(reviewId, isChecked);
            setIsLoading(false);
        };
        toggle();
    }, [isChecked]);

    return (
        <form>
            <input
                onChange={(e) => setIsChecked(e.target.checked)}
                defaultChecked={initialVal}
                type="checkbox"
                name="isShown"
                disabled={isLoading}
            />
            <input hidden name="reviewId" value={reviewId} />
        </form>
    );
};

export default SyncedCheckbox;
