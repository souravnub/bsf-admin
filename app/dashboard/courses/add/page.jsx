import { addCourse } from "@/app/lib/actions";
import { fetchCategories, fetchInstructors } from "@/app/lib/data";
import Category from "@/app/ui/dashboard/courses/addCourseForm/category/category";
import styles from "@/app/ui/dashboard/courses/addCourse/addCourse.module.css";
import Prerequisites from "@/app/ui/dashboard/courses/addCourseForm/prerequisites/prerequisites";
import ImageUpload from "@/app/ui/dashboard/courses/addCourseForm/imageUpload/imageUpload";
import EditableList from "@/app/ui/dashboard/courses/addCourseForm/editableList/editableList";
import CourseSchedulePicker from "@/app/ui/dashboard/courses/addCourseForm/courseSchedulePicker/CourseSchedulePicker";

const AddCoursePage = async () => {
    const [instructors, categories] = await Promise.all([
        fetchInstructors(),
        fetchCategories(),
    ]);

    console.log("instructors are here", instructors);

    const categoriesJSON = JSON.parse(JSON.stringify(categories));

    return (
        <div className={styles.container}>
            <form action={addCourse} className={styles.form}>
                <div className={styles.demandInputContainer}>
                    <label htmlFor="isActive">Is coures active?</label>
                    <input type="checkbox" name="isActive" id="isActive" />
                </div>

                <div>
                    <label htmlFor="name">Course Name*</label>
                    <input type="text" name="name" id="name" required />
                </div>

                <div>
                    <label htmlFor="title">Single Course page title*</label>
                    <input type="text" name="pageTitle" id="title" required />
                </div>

                <div>
                    <label htmlFor="subTitle">
                        Single Course page Sub-title*
                    </label>
                    <input
                        type="text"
                        name="pageSubTitle"
                        id="subTitle"
                        required
                    />
                </div>

                <div className={styles.demandInputContainer}>
                    <label htmlFor="demand">Is in demand?</label>
                    <input type="checkbox" name="isInDemand" />
                </div>

                <div>
                    <label htmlFor="name">Category*</label>
                    <Category categories={categoriesJSON} />
                </div>

                <div>
                    <label htmlFor="instructor">Instructor</label>
                    <select
                        name="instructor"
                        id="instructor"
                        defaultValue={instructors[0].id}
                    >
                        {instructors.map((instructor) => (
                            <option value={instructor.id} key={instructor.id}>
                                {instructor.name}
                            </option>
                        ))}
                    </select>
                </div>

                <ImageUpload requiredInput={true} />

                <div>
                    <label htmlFor="price">Price*</label>
                    <input type="number" name="price" id="price" required />

                    <div className={styles.taxContainer}>
                        <label htmlFor="tax">Price includes tax</label>
                        <input type="checkbox" name="priceIncludesTax" />
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

                <div>
                    <label htmlFor="link">Link for email*</label>
                    <input type="text" name="link" id="link" required />
                </div>

                <button type="submit" className={styles.button}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddCoursePage;
