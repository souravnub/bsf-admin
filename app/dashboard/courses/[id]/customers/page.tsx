import { fetchCourseCustomers } from '@/app/lib/data';
import React from 'react'
import styles from "@/app/ui/dashboard/courses/courses.module.css";
import Link from 'next/link';

const CourseCustomers = async ({ params }: { params: Promise<{ id: string }> }) => {

  const { id } = await params;
  const customers = await fetchCourseCustomers(id)

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Email</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>
                <div className={styles.product}>
                  {customer.name}
                </div>
              </td>
              <td>{customer.email}</td>


              <td>
                <div className={styles.buttons}>
                  <Link
                    href={`/dashboard/customers/${customer.id}`}
                  >
                    <button
                      className={`${styles.button} ${styles.view}`}
                    >
                      View
                    </button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  )
}

export default CourseCustomers