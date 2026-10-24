import styles from "./designs.module.css";

export default function DesignCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className={`${styles.card} ${styles.skeleton}`}
      aria-hidden="true"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonBody}>
        {Array.from({ length: 4 }, (_, line) => (
          <div key={line} className={styles.skeletonLine} />
        ))}
      </div>
    </div>
  );
}
