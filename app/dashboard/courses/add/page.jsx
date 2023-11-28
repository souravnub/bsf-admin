import { addCourse } from "@/app/lib/actions";
import { fetchCategories } from "@/app/lib/data";
import Category from "@/app/ui/dashboard/courses/addCourseForm/category/category";
import styles from "@/app/ui/dashboard/courses/addCourse/addCourse.module.css";
import Features from "@/app/ui/dashboard/courses/addCourseForm/features/features";
import Prerequisites from "@/app/ui/dashboard/courses/addCourseForm/prerequisites/prerequisites";
import ImageUpload from "@/app/ui/dashboard/courses/addCourseForm/imageUpload/imageUpload";

const AddProductPage = async () => {
    const categories = await fetchCategories();
    const categoriesJSON = JSON.parse(JSON.stringify(categories));

    return (
        <div className={styles.container}>
            <form action={addCourse} className={styles.form}>
                <div>
                    <label htmlFor='name'>Course Name*</label>
                    <input type='text' name='name' id='name' required />
                </div>

                <div>
                    <label htmlFor='name'>Category*</label>
                    <Category categories={categoriesJSON} />
                </div>

                <ImageUpload />

                <div>
                    <label htmlFor='price'>Price*</label>
                    <input type='number' name='price' id='price' required />
                </div>

                <div>
                    <label htmlFor='desc'>Course Description*</label>
                    <textarea
                        cols={20}
                        rows={20}
                        name='description'
                        id='desc'
                        required
                    />
                </div>

                <Features />
                <Prerequisites />
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
};

export default AddProductPage;
