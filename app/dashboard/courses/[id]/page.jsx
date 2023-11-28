import { updateProduct } from "@/app/lib/actions";
import { fetchCategories, fetchCourse } from "@/app/lib/data";
import Category from "@/app/ui/dashboard/courses/addCourseForm/category/category";
import styles from "@/app/ui/dashboard/courses/singleCourse/singleCourse.module.css";
import Image from "next/image";

const SingleProductPage = async ({ params }) => {
    const { id } = params;
    const course = await fetchCourse(id);
    const categories = await fetchCategories();
    const categoriesJSON = JSON.parse(JSON.stringify(categories));

    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <div className={styles.imgContainer}>
                    <Image
                        src={course.image}
                        alt='Course Banner'
                        width={312}
                        height={312}
                    />
                </div>
                {course.title}
            </div>
            <div className={styles.formContainer}>
                <form action={updateProduct} className={styles.form}>
                    <input type='hidden' name='id' value={course.id} />
                    <label>Course Name</label>
                    <input type='text' name='title' placeholder={course.name} />
                    <label>Price</label>
                    <input
                        type='number'
                        name='price'
                        placeholder={"$" + course.price}
                    />
                    <label>Students Enrolled</label>
                    <input
                        type='number'
                        name='stock'
                        readOnly
                        placeholder={course.customers.length}
                    />
                    <label>Category</label>
                    <Category
                        categories={categoriesJSON}
                        selected={course.category._id}
                    />
                    <label>Description</label>
                    <textarea
                        name='desc'
                        id='desc'
                        rows='10'
                        placeholder={course.description}
                    ></textarea>
                    <button>Update</button>
                </form>
            </div>
        </div>
    );
};

export default SingleProductPage;
