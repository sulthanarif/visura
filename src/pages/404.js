import styles from '../styles/custom404.module.css';
import Link from 'next/link';

export default function Custom404() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404</h1>
            <p className={styles.description}>Oops! Page Not Found</p>
            <p className={styles.text}>The page you're looking for doesn't exist or has been moved.</p>
            <Link href="/" className={styles.button}>
                GET OUT OF HERE!
            </Link>
        </div>
    );
}