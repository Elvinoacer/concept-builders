import styles from "@/components/design-detail/detail.module.css";

export default function Loading() {
  return (
    <div className={styles.loading} role="status" aria-label="Loading design">
      <div className={styles.loadingInner}>
        <p className={styles.eyebrow}>A closer look at your next home</p>
        <div className={styles.loadingTitle} aria-hidden="true" />
        <div className={styles.loadingPhoto} aria-hidden="true" />
        <span className={styles.srOnly}>
          Preparing the design, views, and drawing options.
        </span>
      </div>
    </div>
  );
}
