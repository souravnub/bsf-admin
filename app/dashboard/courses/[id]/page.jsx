import { updateCourse } from "@/app/lib/actions";
import { fetchCategories, fetchCourse } from "@/app/lib/data";
import Category from "@/app/ui/dashboard/courses/addCourseForm/category/category";
import EditableList from "@/app/ui/dashboard/courses/addCourseForm/editableList/editableList";
import ImageUpload from "@/app/ui/dashboard/courses/addCourseForm/imageUpload/imageUpload";
import Prerequisites from "@/app/ui/dashboard/courses/addCourseForm/prerequisites/prerequisites";
import styles from "@/app/ui/dashboard/courses/singleCourse/singleCourse.module.css";
import addCoursePageStyles from "@/app/ui/dashboard/courses/addCourse/addCourse.module.css";
import CourseSchedulePicker from "@/app/ui/dashboard/courses/addCourseForm/courseSchedulePicker/CourseSchedulePicker";

const SingleProductPage = async ({ params }) => {
    const { id } = params;
    const course = await fetchCourse(id);
    const categories = await fetchCategories();

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <form action={updateCourse} className={styles.form}>
                    <div className={styles.infoContainer}>
                        <ImageUpload source={course.image} />
                        {course.title}
                    </div>
                    <input
                        type="hidden"
                        name="id"
                        defaultValue={String(course._id)}
                    />
                    <label>Course Name</label>
                    <input type="text" name="name" defaultValue={course.name} />

                    <div className={addCoursePageStyles.demandInputContainer}>
                        <label htmlFor="demand">Is in demand?</label>
                        <input
                            type="checkbox"
                            name="isInDemand"
                            defaultChecked={course.isInDemand}
                            value="true"
                        />
                    </div>

                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        defaultValue={course.price}
                    />
                    <div class={addCoursePageStyles.taxContainer}>
                        <label htmlFor="tax">Price includes tax</label>
                        <input
                            id="tax"
                            type="checkbox"
                            name="priceIncludesTax"
                            value="true"
                            defaultChecked={course.priceIncludesTax}
                        />
                    </div>
                    <label>Students Enrolled</label>
                    <input
                        type="number"
                        name="stock"
                        readOnly
                        value={course.customers.length}
                    />
                    <label>Category</label>
                    <Category
                        categories={categories}
                        selected={course.category.category}
                    />
                    <EditableList
                        list={course.jobOpportunities}
                        title="Job Opporunities"
                        name="jobOpportunities"
                    />
                    <EditableList
                        list={course.learnings.tools}
                        title="Tools learned"
                        name="tools"
                    />
                    <EditableList
                        list={course.learnings.other}
                        title="Other learnings"
                        name="other"
                    />

                    <Prerequisites prerequisites={course.prequisites} />

                    <CourseSchedulePicker info={course.schedule} />

                    <label>Description</label>
                    <textarea
                        name="description"
                        id="desc"
                        rows="10"
                        defaultValue={course.description}
                    ></textarea>
                    <button class={styles.button}>Update</button>
                </form>
            </div>
        </div>
    );
};

export default SingleProductPage;
