import styles from "./AminDashboard.module.css";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
};

const StatCard = ({
  title,
  value,
  change,
  positive = true,
}: StatCardProps) => {
  return (
    <div className={styles.statCard}>
      <p className={styles.statLabel}>{title}</p>

      <h2 className={styles.statValue}>{value}</h2>

      <p
        className={`${styles.statChange} ${
          positive ? styles.positive : styles.negative
        }`}
      >
        {change}
      </p>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className={styles.dashboard}>
      <section className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>

          <p className={styles.pageDescription}>
            Welcome back. Here is an overview of your business.
          </p>
        </div>

        <button className={styles.primaryButton}>
          + New Order
        </button>
      </section>

      <section className={styles.statsGrid}>
        <StatCard
          title="Today's Sales"
          value="£2,486"
          change="+12.5% from yesterday"
        />

        <StatCard
          title="Orders"
          value="148"
          change="+8.2% from yesterday"
        />

        <StatCard
          title="Customers"
          value="96"
          change="+4.3% from yesterday"
        />

        <StatCard
          title="Refunds"
          value="£84"
          change="-2.4% from yesterday"
          positive={false}
        />
      </section>

      <section className={styles.mainGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>
                Sales Overview
              </h2>

              <p className={styles.cardDescription}>
                Revenue performance for this week
              </p>
            </div>

            <select className={styles.select}>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>

          <div className={styles.chartPlaceholder}>
            <div>
              <strong>Sales Chart</strong>
              <span>
                Add Recharts or Chart.js here later
              </span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>
                Quick Actions
              </h2>

              <p className={styles.cardDescription}>
                Common dashboard actions
              </p>
            </div>
          </div>

          <div className={styles.quickActions}>
            <button className={styles.quickAction}>
              <span>+</span>
              New Sale
            </button>

            <button className={styles.quickAction}>
              <span>+</span>
              Add Product
            </button>

            <button className={styles.quickAction}>
              <span>▦</span>
              View Orders
            </button>

            <button className={styles.quickAction}>
              <span>▤</span>
              Reports
            </button>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>
              Recent Orders
            </h2>

            <p className={styles.cardDescription}>
              Latest customer transactions
            </p>
          </div>

          <button className={styles.secondaryButton}>
            View All
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>#1001</td>
                <td>John Smith</td>
                <td>Card</td>
                <td>£24.50</td>
                <td>
                  <span
                    className={`${styles.status} ${styles.completed}`}
                  >
                    Completed
                  </span>
                </td>
              </tr>

              <tr>
                <td>#1002</td>
                <td>Sarah Patel</td>
                <td>Cash</td>
                <td>£18.20</td>
                <td>
                  <span
                    className={`${styles.status} ${styles.pending}`}
                  >
                    Pending
                  </span>
                </td>
              </tr>

              <tr>
                <td>#1003</td>
                <td>David Brown</td>
                <td>Card</td>
                <td>£42.99</td>
                <td>
                  <span
                    className={`${styles.status} ${styles.completed}`}
                  >
                    Completed
                  </span>
                </td>
              </tr>

              <tr>
                <td>#1004</td>
                <td>Lisa Jones</td>
                <td>Card</td>
                <td>£12.10</td>
                <td>
                  <span
                    className={`${styles.status} ${styles.cancelled}`}
                  >
                    Cancelled
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;