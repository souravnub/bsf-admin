import { addCourse } from "@/app/lib/actions";
import { fetchCategories } from "@/app/lib/data";
import Category from "@/app/ui/dashboard/courses/addCourseForm/category/category";
import styles from "@/app/ui/dashboard/courses/addCourse/addCourse.module.css";
import Prerequisites from "@/app/ui/dashboard/courses/addCourseForm/prerequisites/prerequisites";
import ImageUpload from "@/app/ui/dashboard/courses/addCourseForm/imageUpload/imageUpload";
import EditableList from "@/app/ui/dashboard/courses/addCourseForm/editableList/editableList";

const AddProductPage = async () => {
    const categories = await fetchCategories();
    const categoriesJSON = JSON.parse(JSON.stringify(categories));

    return (
        <div className={styles.container}>
            <form action={addCourse} className={styles.form}>
                <div>
                    <label htmlFor="name">Course Name*</label>
                    <input type="text" name="name" id="name" required />
                </div>

                <div>
                    <label htmlFor="name">Category*</label>
                    <Category categories={categoriesJSON} />
                </div>

                <ImageUpload />

                <div>
                    <label htmlFor="price">Price*</label>
                    <input type="number" name="price" id="price" required />
                </div>

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

                <EditableList title="Tools learned" name="tools" />
                <EditableList title="Other learnings" name="other" />
                <Prerequisites prerequisites={[]} />
                <button type="submit" className={styles.button}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddProductPage;
