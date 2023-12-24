import { addCourse } from "@/app/lib/actions";
import { fetchCategories } from "@/app/lib/data";
import Category from "@/app/ui/dashboard/courses/addCourseForm/category/category";
import styles from "@/app/ui/dashboard/courses/addCourse/addCourse.module.css";
import Prerequisites from "@/app/ui/dashboard/courses/addCourseForm/prerequisites/prerequisites";
import ImageUpload from "@/app/ui/dashboard/courses/addCourseForm/imageUpload/imageUpload";
import EditableList from "@/app/ui/dashboard/courses/addCourseForm/editableList/editableList";
import CourseSchedulePicker from "@/app/ui/dashboard/courses/addCourseForm/courseSchedulePicker/CourseSchedulePicker";

const AddCoursePage = async () => {
    const categories = await fetchCategories();
    const categoriesJSON = JSON.parse(JSON.stringify(categories));

    return (
        <div className={styles.container}>
            <form action={addCourse} className={styles.form}>
                <div>
                    <label htmlFor="name">Course Name*</label>
                    <input type="text" name="name" id="name" required />
                </div>

                <div className={styles.demandInputContainer}>
                    <label htmlFor="demand">Is in demand?</label>
                    <input type="checkbox" name="isInDemand" value="true" />
                </div>

                <div>
                    <label htmlFor="name">Category*</label>
                    <Category categories={categoriesJSON} />
                </div>

                <ImageUpload requiredInput={true} index={0} />

                <div>
                    <label htmlFor="price">Price*</label>
                    <input type="number" name="price" id="price" required />

                    <div className={styles.taxContainer}>
                        <label htmlFor="tax">Price includes tax</label>
                        <input
                            type="checkbox"
                            name="priceIncludesTax"
                            value="true"
                        />
                    </div>
                </div>

                <EditableList
                    title="Job Opportunities"
                    name="jobOpportunities"
                />
                <EditableList title="Tools learned" name="tools" />
                <EditableList title="Other learnings" name="other" />
                <Prerequisites prerequisites={[]} />

                <CourseSchedulePicker />

                <div>
                    <label htmlFor="desc">Course Description*</label>
                    <textarea
                        cols={20}
                        rows={20}
                        name="description"
                        id="desc"
                        required
                    />
                </div>

                <button type="submit" className={styles.button}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddCoursePage;
