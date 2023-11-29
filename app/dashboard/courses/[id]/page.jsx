import { updateCourse } from "@/app/lib/actions";
import { fetchCategories, fetchCourse } from "@/app/lib/data";
import Category from "@/app/ui/dashboard/courses/addCourseForm/category/category";
import Features from "@/app/ui/dashboard/courses/addCourseForm/features/features";
import ImageUpload from "@/app/ui/dashboard/courses/addCourseForm/imageUpload/imageUpload";
import Prerequisites from "@/app/ui/dashboard/courses/addCourseForm/prerequisites/prerequisites";
import styles from "@/app/ui/dashboard/courses/singleCourse/singleCourse.module.css";

const SingleProductPage = async ({ params }) => {
    const { id } = params;
    const course = await fetchCourse(id);
    const categories = await fetchCategories();
    const categoriesJSON = JSON.parse(JSON.stringify(categories));

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <form action={updateCourse} className={styles.form}>
                    <div className={styles.infoContainer}>
                        {/* <div className={styles.imgContainer}>
                    <Image
                        src={course.image}
                        alt='Course Banner'
                        width={312}
                        height={312}
                    />
                </div> */}
                        <ImageUpload url={course.image} />
                        {course.title}
                    </div>
                    <input
                        type='hidden'
                        name='id'
                        defaultValue={String(course._id)}
                    />
                    <label>Course Name</label>
                    <input
                        type='text'
                        name='title'
                        defaultValue={course.name}
                    />
                    <label>Price</label>
                    <input
                        type='number'
                        name='price'
                        defaultValue={course.price}
                    />
                    <label>Students Enrolled</label>
                    <input
                        type='number'
                        name='stock'
                        readOnly
                        value={course.customers.length}
                    />
                    <label>Category</label>
                    <Category
                        categories={categoriesJSON}
                        selected={course.category._id}
                    />
                    <Features features={course.features} />
                    <Prerequisites prequisites={course.prequisites} />
                    <label>Description</label>
                    <textarea
                        name='desc'
                        id='desc'
                        rows='10'
                        defaultValue={course.description}
                    ></textarea>
                    <button>Update</button>
                </form>
            </div>
        </div>
    );
};

export default SingleProductPage;
