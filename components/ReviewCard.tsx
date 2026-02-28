import React from "react";
import styles from "./ReviewCard.module.css";

type ReviewCardProps = {
  name: string;
  date: string; // e.g. "12 / 3 / 2025"
  text: string;
  avatarColor?: "yellow" | "teal" | "red" | "purple" | "gray";
};

const colorClassMap: Record<NonNullable<ReviewCardProps["avatarColor"]>, string> =
  {
    yellow: styles.avatarYellow,
    teal: styles.avatarTeal,
    red: styles.avatarRed,
    purple: styles.avatarPurple,
    gray: styles.avatarGray,
  };

export default function ReviewCard({
  name,
  date,
  text,
  avatarColor = "yellow",
}: ReviewCardProps) {
  return (
    <div className={styles.card}>
          <div className={styles.header}>
              <div className={`${styles.avatar} ${colorClassMap[avatarColor]}`}>
                <div className={styles.avatarHead} />
                <div className={styles.avatarBody} />
              </div>

          <div className={styles.meta}>
              <div className={styles.name}>{name}</div>
              <div className={styles.date}>{date}</div>
          </div>
      </div>
      <p className={styles.text}>{text}</p>
    </div>
  );
}