import NavbarStaffButton from "../../../components/NavbarStaffButton/NavbarStaffButton";


import style from "./BranchDashboard.module.css";
type BranchDashboardProps = {
  onLogout: () => void;
};

const BranchDashboard = ({ onLogout }: BranchDashboardProps) => {

  return (
    <>
      

      <div className={style.branchDashboardMainContainer}>
        <div className={style.calendar}>
          <div className={style.calendarHeader}>
            <button
              type="button"
              className={style.calendarIconPre}
            >
              ‹
            </button>

            <div>Month Name</div>

            <button
              type="button"
              className={style.calendarIconNext}
            >
              ›
            </button>
          </div>

          <div className={style.calendarBody}>
            <div className={style.calendarWeekdays}>
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            <div className={style.calendarDays}>
              <div className={style.calendarDay}>1</div>
              <div className={style.calendarDay}>2</div>
              <div className={style.calendarDay}>3</div>
              <div className={style.calendarDay}>4</div>
              <div className={style.calendarDay}>5</div>
              <div className={style.calendarDay}>6</div>
              <div className={style.calendarDay}>7</div>

              <div className={style.calendarDay}>8</div>
              <div className={style.calendarDay}>9</div>
              <div className={style.calendarDay}>10</div>
              <div className={style.calendarDay}>11</div>
              <div className={style.calendarDay}>12</div>
              <div className={style.calendarDay}>13</div>
              <div className={style.calendarDay}>14</div>

              <div className={style.calendarDay}>15</div>
              <div className={style.calendarDay}>16</div>
              <div className={style.calendarDay}>17</div>
              <div className={style.calendarDay}>18</div>
              <div className={style.calendarDay}>19</div>
              <div className={style.calendarDay}>20</div>
              <div className={style.calendarDay}>21</div>

              <div className={style.calendarDay}>22</div>
              <div className={style.calendarDay}>23</div>
              <div className={style.calendarDay}>24</div>
              <div className={style.calendarDay}>25</div>
              <div className={style.calendarDay}>26</div>
              <div className={style.calendarDay}>27</div>
              <div className={style.calendarDay}>28</div>

              <div className={style.calendarDay}>29</div>
              <div className={style.calendarDay}>30</div>
              <div className={style.calendarDay}>31</div>
            </div>
          </div>
        </div>

        <div className={style.workingBranchContainer}>
          <div className={style.workingPharmacist}>
            <div className={style.headingBranchContainer}>
              Pharmacist
            </div>

            <ul>
              <li>Arti-Kiran Chauhan</li>
            </ul>
          </div>

          <div className={style.workingBranchMember}>
            <div className={style.headingBranchContainer}>
              Staff
            </div>

            <ul>
              <li>John Doe</li>
            </ul>
          </div>

          <div className={style.holidaySatffMember}>
            <div className={style.headingBranchContainer}>
              On Holiday
            </div>

            <ul>
              <li>Jane Doe</li>
            </ul>
          </div>

          <div className={style.sickBranchMember}>
            <div className={style.headingBranchContainer}>
              On Sick Leave
            </div>

            <ul>
              <li>Jane Doe</li>
            </ul>
          </div>
        </div>
      </div>

      <NavbarStaffButton onLogout={onLogout} />
    </>
  );
};

export default BranchDashboard;