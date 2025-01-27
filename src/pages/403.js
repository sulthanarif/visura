import styles from '../styles/custom403.module.css';
import Icon from '@/components/atoms/Icon';
import Link from 'next/link';

export default function Custom403() {
    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>403</h1>
                <Icon name="ban" className="text-white text-5xl mb-3"/>
            </div>
            <p className={styles.description}>Forbidden</p>
            <p className={styles.text}>You do not have permission to access this page.</p>
            <Link href="/" className={styles.button}>
                Go Back Home
            </Link>
        </div>
    );
}