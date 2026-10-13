const SUPABASE_URL = "https://kpbyxgdgbizeipsacbqd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYnl4Z2RnYml6ZWlwc2FjYnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4OTgzNDksImV4cCI6MjEwNzQ3NDM0OX0.KgP4VSfPVpdxN4RsBScUC0IfxxTFtY5anKbB-OCG21s";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let absentStudents = new Set();
let allStudentsInClass = [];
let institutionSettings = { college_name: '', department_name: '' };
let currentUserProfile = null;

document.addEventListener("DOMContentLoaded", async () => {
  await checkAuth();

  const today = new Date().toISOString().split("T")[0];
  const markDate = document.getElementById("mark-date");
  const regFrom = document.getElementById("reg-from");
  const regTo = document.getElementById("reg-to");

  if (markDate) markDate.value = today;
  if (regFrom) regFrom.value = today;
  if (regTo) regTo.value = today;

  await loadInstitutionInfo();
  await loadClassDropdowns();
});

async function checkAuth() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const { data: profile } = await db.from("profiles").select("*").eq("id", session.user.id).single();
  if (profile) {
    currentUserProfile = profile;
    const teacherInput = document.getElementById("mark-teacher");
    if (teacherInput) teacherInput.value = profile.name;

    const adminBtn = document.querySelector('a[href="admin.html"]');
    if (adminBtn && profile.role === 'STAFF') {
      adminBtn.style.display = 'none';
    }
  }
}

async function handleLogout() {
  await db.auth.signOut();
  window.location.href = "login.html";
}

function showTab(tab) {
  document.getElementById("tab-mark").classList.toggle("hidden", tab !== "mark");
  document.getElementById("tab-register").classList.toggle("hidden", tab !== "register");
}

async function loadInstitutionInfo() {
  const { data } = await db.from("institution_settings").select("*").eq("id", 1).single();
  if (data) institutionSettings = data;
}

async function loadClassDropdowns() {
  const { data: classes } = await db.from("classes").select("*").order("name");
  const markSel = document.getElementById("mark-class");
  const regSel = document.getElementById("reg-class");

  if (markSel) markSel.innerHTML = '<option value="">-- Choose Class --</option>';
  if (regSel) regSel.innerHTML = '';

  (classes || []).forEach(c => {
    if (markSel) markSel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    if (regSel) regSel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });
}

// Called when teacher selects a class
async function onClassChange() {
  const classId = document.getElementById("mark-class").value;
  await loadSubjectsForClass(classId);
  await loadStudents();
}

// 1. Populate Subject Dropdown based on Staff allocation
async function loadSubjectsForClass(classId) {
  const subSel = document.getElementById("mark-subject");
  subSel.innerHTML = '<option value="">-- Select Subject --</option>';

  if (!classId) return;

  // First check if staff has allocated subjects for this class
  let allocatedSubjects = [];
  if (currentUserProfile) {
    const { data: allocs } = await db.from("course_allocations")
      .select("subject_id, subjects(id, code, name)")
      .eq("class_id", classId)
      .eq("staff_id", currentUserProfile.id);

    if (allocs && allocs.length > 0) {
      allocatedSubjects = allocs.map(a => a.subjects).filter(Boolean);
    }
  }

  // If allocated subjects exist, prioritize them in the dropdown
  if (allocatedSubjects.length > 0) {
    allocatedSubjects.forEach(s => {
      subSel.innerHTML += `<option value="${s.id}" selected>${s.code} - ${s.name}</option>`;
    });
  } else {
    // Fallback: list all subjects if no direct allocation exists (or for HOD/Admin)
    const { data: allSubs } = await db.from("subjects").select("*").order("code");
    (allSubs || []).forEach(s => {
      subSel.innerHTML += `<option value="${s.id}">${s.code} - ${s.name}</option>`;
    });
  }
}

// 2. Load Student Roster
async function loadStudents() {
  const classId = document.getElementById("mark-class").value;
  const grid = document.getElementById("student-grid");
  absentStudents.clear();
  updateAbsentCount();

  if (!classId) {
    grid.innerHTML = '<p class="text-xs text-slate-400 col-span-2 p-3 text-center">Select a class first</p>';
    allStudentsInClass = [];
    return;
  }

  const { data: students } = await db.from("students").select("*").eq("class_id", classId).order("roll_no");
  if (!students || students.length === 0) {
    grid.innerHTML = '<p class="text-xs text-red-500 col-span-2 p-3 text-center">No students found. Add via Admin.</p>';
    allStudentsInClass = [];
    return;
  }

  allStudentsInClass = students;

  grid.innerHTML = students.map(s => `
    <button type="button" id="st-${s.id}" onclick="toggleAbsent(${s.id})"
      class="p-2 border rounded text-left text-xs bg-white text-slate-800 transition">
      <div class="font-bold">${s.roll_no}</div>
      <div class="truncate text-[11px]">${s.name}</div>
      <div id="st-badge-${s.id}" class="text-[10px] text-emerald-600 font-semibold mt-1">PRESENT</div>
    </button>
  `).join('');
}

function updateAbsentCount() {
  const badge = document.getElementById("absent-count-badge");
  if (badge) {
    badge.textContent = `${absentStudents.size} Absent`;
  }
}

function toggleAbsent(id) {
  const btn = document.getElementById(`st-${id}`);
  const badge = document.getElementById(`st-badge-${id}`);

  if (absentStudents.has(id)) {
    absentStudents.delete(id);
    btn.className = "p-2 border rounded text-left text-xs bg-white text-slate-800";
    badge.textContent = "PRESENT";
    badge.className = "text-[10px] text-emerald-600 font-semibold mt-1";
  } else {
    absentStudents.add(id);
    btn.className = "p-2 border rounded text-left text-xs bg-red-500 text-white font-bold";
    badge.textContent = "ABSENT";
    badge.className = "text-[10px] text-white font-bold mt-1";
  }
  updateAbsentCount();
}

// 3. Quick Absentee Entry by Typing "1, 34, 56" and Enter
function handleQuickRollKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    applyQuickRolls();
  }
}

function applyQuickRolls() {
  const input = document.getElementById("quick-roll-input");
  const rawText = input.value.trim();
  if (!rawText) return;

  // Split by comma or space
  const inputRolls = rawText.split(/[\s,]+/).map(r => r.trim()).filter(Boolean);

  inputRolls.forEach(rollStr => {
    // Match roll numbers flexibly (e.g. "1" matches "1" or "01")
    const matched = allStudentsInClass.find(s => 
      String(s.roll_no).toLowerCase() === rollStr.toLowerCase() ||
      parseInt(s.roll_no, 10) === parseInt(rollStr, 10)
    );

    if (matched && !absentStudents.has(matched.id)) {
      absentStudents.add(matched.id);
      const btn = document.getElementById(`st-${matched.id}`);
      const badge = document.getElementById(`st-badge-${matched.id}`);
      if (btn && badge) {
        btn.className = "p-2 border rounded text-left text-xs bg-red-500 text-white font-bold";
        badge.textContent = "ABSENT";
        badge.className = "text-[10px] text-white font-bold mt-1";
      }
    }
  });

  updateAbsentCount();
  input.value = "";
}

// 4. Submit Attendance
async function submitAttendance() {
  const classId = document.getElementById("mark-class").value;
  const date = document.getElementById("mark-date").value;
  const period = parseInt(document.getElementById("mark-period").value);
  const teacher = document.getElementById("mark-teacher").value.trim();
  const subjectId = document.getElementById("mark-subject").value || null;

  if (!classId || !teacher) return alert("Fill Class and Teacher name");

  const btn = document.getElementById("btn-submit");
  btn.disabled = true;
  btn.textContent = "Saving...";

  const { data: session, error } = await db.from("attendance_sessions").upsert({
    class_id: classId,
    attendance_date: date,
    period_num: period,
    teacher_name: teacher,
    teacher_id: currentUserProfile?.id || null,
    subject_id: subjectId
  }, { onConflict: "class_id,attendance_date,period_num" }).select().single();

  if (error) {
    alert("Error: " + error.message);
    btn.disabled = false;
    btn.textContent = "Save Attendance";
    return;
  }

  await db.from("attendance_absentees").delete().eq("session_id", session.id);

  if (absentStudents.size > 0) {
    const payload = Array.from(absentStudents).map(stId => ({
      session_id: session.id,
      student_id: stId
    }));
    await db.from("attendance_absentees").insert(payload);
  }

  alert("Attendance Saved Successfully!");
  btn.disabled = false;
  btn.textContent = "Save Attendance";
}

// 5. Generate Register Sheet
async function generateBook() {
  const classId = document.getElementById("reg-class").value;
  const fromDate = document.getElementById("reg-from").value;
  const toDate = document.getElementById("reg-to").value;
  let pageNo = parseInt(document.getElementById("reg-page-start").value) || 1;
  const container = document.getElementById("pages-container");

  container.innerHTML = "<p class='no-print text-sm p-4'>Compiling sheets...</p>";

  const { data: sessions, error } = await db.from("attendance_sessions").select(`
    id, attendance_date, period_num, teacher_name,
    subjects ( code ),
    attendance_absentees ( students ( id, roll_no, name ) )
  `)
  .eq("class_id", classId)
  .gte("attendance_date", fromDate)
  .lte("attendance_date", toDate)
  .order("period_num");

  if (error) {
    container.innerHTML = `<p class='no-print text-sm text-red-500 p-4'>Error: ${error.message}</p>`;
    return;
  }

  const dateMap = {};
  (sessions || []).forEach(s => {
    if (!dateMap[s.attendance_date]) dateMap[s.attendance_date] = [];
    dateMap[s.attendance_date].push(s);
  });

  const dates = Object.keys(dateMap).sort();
  if (dates.length === 0) {
    container.innerHTML = "<p class='no-print text-sm text-red-500 p-4'>No attendance records found.</p>";
    return;
  }

  container.innerHTML = "";
  const roman = ["I", "II", "III", "IV", "V", "VI"];

  dates.forEach(d => {
    const daySessions = dateMap[d] || [];
    const pMap = {};
    const studentAbsences = {};

    daySessions.forEach(s => {
      const absFormatted = s.attendance_absentees
        .map(a => `${a.students.roll_no} - ${a.students.name}`)
        .join(", ");

      pMap[s.period_num] = {
        teacher: s.teacher_name,
        subject: s.subjects?.code || "",
        absentees: absFormatted,
        count: s.attendance_absentees.length
      };

      s.attendance_absentees.forEach(a => {
        const sid = a.students.id;
        if (!studentAbsences[sid]) studentAbsences[sid] = { text: `${a.students.roll_no} - ${a.students.name}`, count: 0, periods: [] };
        studentAbsences[sid].count++;
        studentAbsences[sid].periods.push(s.period_num);
      });
    });

    const hourly = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    const fn = [], an = [];
    Object.values(studentAbsences).forEach(st => {
      if (hourly[st.count]) hourly[st.count].push(st.text);
      if ([1, 2, 3].every(p => st.periods.includes(p))) fn.push(st.text);
      if ([4, 5, 6].every(p => st.periods.includes(p))) an.push(st.text);
    });

    const rows = [1, 2, 3, 4, 5, 6].map(num => `
      <tr style="min-height: 28px;">
        <td class="border border-black text-center font-bold py-1">${roman[num-1]}</td>
        <td class="border border-black px-2 py-1 text-xs truncate max-w-[110px]">${pMap[num]?.teacher || ""}</td>
        <td class="border border-black px-2 py-1 text-xs text-center font-semibold">${pMap[num]?.subject || ""}</td>
        <td class="border border-black px-2 py-1 text-[10.5px] leading-snug break-words">${pMap[num]?.absentees || ""}</td>
        <td class="border border-black text-center font-medium">${pMap[num]?.count ?? ""}</td>
        <td class="border border-black"></td>
      </tr>
    `).join("");

    const dayName = new Date(d).toLocaleDateString("en-US", { weekday: "long" });

    container.innerHTML += `
      <div class="a4-page bg-white border border-neutral-300 p-[10mm] shadow-lg w-[210mm] h-[297mm] max-h-[297mm] overflow-hidden flex flex-col justify-between font-serif mb-8">
        <div>
          <div class="text-center font-bold">
            <h1 class="text-base uppercase tracking-wider">${institutionSettings.college_name || 'COLLEGE NAME'}</h1>
            <h2 class="text-sm font-semibold uppercase">${institutionSettings.department_name || 'DEPARTMENT NAME'}</h2>
          </div>
          <div class="flex justify-between items-end mt-2 mb-1 border-b border-black pb-1">
            <div class="text-red-600 font-bold text-lg">${pageNo++}</div>
            <div class="text-lg font-bold tracking-widest text-center uppercase">ATTENDANCE BOOK</div>
            <div class="w-6"></div>
          </div>
          <div class="flex justify-between text-xs font-semibold mt-1 mb-2">
            <div>Date: <span class="underline ml-1">${d}</span></div>
            <div>Day: <span class="underline ml-1">${dayName}</span></div>
          </div>
          <table class="w-full border-collapse border border-black text-xs">
            <thead>
              <tr class="border-b border-black text-[11px] font-bold bg-neutral-50">
                <th class="border border-black p-1 w-[8%] text-center leading-tight">Hour/<br>Period</th>
                <th class="border border-black p-1 w-[20%] text-center">Name of Teacher</th>
                <th class="border border-black p-1 w-[12%] text-center">Subject</th>
                <th class="border border-black p-1 w-[42%] text-center">Absentees (Roll No - Name)</th>
                <th class="border border-black p-1 w-[8%] text-center leading-tight">No. of<br>Absen-tees</th>
                <th class="border border-black p-1 w-[10%] text-center">Signature</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>

        <div class="mt-4">
          <table class="w-full border-collapse border border-black text-xs mb-3">
            <thead>
              <tr class="bg-neutral-800 text-white text-center font-bold text-[11px]">
                <th colSpan="6" class="border border-black py-0.5">Absentees</th>
              </tr>
              <tr class="border-b border-black text-[10px] font-bold">
                <th class="border border-black p-1 w-1/6">1 Hour/Period</th>
                <th class="border border-black p-1 w-1/6">2 Hours/Periods</th>
                <th class="border border-black p-1 w-1/6">3 Hours/Periods</th>
                <th class="border border-black p-1 w-1/6">4 Hours/Periods</th>
                <th class="border border-black p-1 w-1/6">5 Hours/Periods</th>
                <th class="border border-black p-1 w-1/6">6 Hours/Periods<br>(Full day)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="h-[52px] align-top text-[9.5px] leading-tight">
                ${[1,2,3,4,5,6].map(n => `<td class="border border-black p-1 break-words">${hourly[n].join(", ")}</td>`).join("")}
              </tr>
            </tbody>
          </table>

          <table class="w-[65%] mx-auto border-collapse border border-black text-xs">
            <thead>
              <tr class="bg-neutral-800 text-white text-center font-bold text-[10.5px]">
                <th class="border border-black py-0.5 w-1/2">Half Day (FN)</th>
                <th class="border border-black py-0.5 w-1/2">Half Day (AN)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="h-[46px] align-top text-[9.5px] leading-tight">
                <td class="border border-black p-1 break-words">${fn.join(", ")}</td>
                <td class="border border-black p-1 break-words">${an.join(", ")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  });
}
