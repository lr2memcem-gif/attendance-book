<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Portal - Attendance System</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <!-- SheetJS Library for Excel Import/Export -->
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
</head>
<body class="bg-slate-100 text-slate-900 font-sans p-4">

  <div class="max-w-2xl mx-auto space-y-6">
    <div class="flex justify-between items-center border-b pb-3">
      <h1 class="text-xl font-bold">Admin Management</h1>
      <a href="index.html" class="text-xs bg-slate-800 text-white px-3 py-1.5 rounded font-semibold">Back to Home</a>
    </div>

    <!-- 1. INSTITUTION SETTINGS -->
    <div class="bg-white p-5 rounded-lg shadow border border-slate-200">
      <h2 class="text-base font-bold mb-3 border-b pb-1">1. College & Department Details</h2>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600">College Name</label>
          <input type="text" id="cfg-college" class="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. GOVERNMENT ENGINEERING COLLEGE">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600">Department Name</label>
          <input type="text" id="cfg-dept" class="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING">
        </div>
        <button onclick="saveSettings()" id="btn-save-cfg" class="bg-blue-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-700">
          Save Header Info
        </button>
      </div>
    </div>

    <!-- 2. CREATE STAFF / HOD LOGINS -->
    <div class="bg-white p-5 rounded-lg shadow border border-slate-200">
      <h2 class="text-base font-bold mb-3 border-b pb-1">2. Create Staff / HOD / Admin Login</h2>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600">Staff Full Name</label>
          <input type="text" id="staff-name" placeholder="e.g. Prof. Ramesh Kumar" class="w-full border p-2 rounded text-sm mt-1">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600">Email Address</label>
          <input type="email" id="staff-email" placeholder="ramesh@college.edu" class="w-full border p-2 rounded text-sm mt-1">
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-semibold text-slate-600">Password</label>
            <input type="password" id="staff-pass" placeholder="Min. 6 characters" class="w-full border p-2 rounded text-sm mt-1">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600">Role</label>
            <select id="staff-role" class="w-full border p-2 rounded text-sm mt-1">
              <option value="STAFF">Staff</option>
              <option value="HOD">HOD</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
        <button onclick="createStaffAccount()" id="btn-create-staff" class="bg-purple-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-purple-700">
          Create Staff Account
        </button>
      </div>
    </div>

    <!-- 3. MANAGE CLASSES -->
    <div class="bg-white p-5 rounded-lg shadow border border-slate-200">
      <h2 class="text-base font-bold mb-3 border-b pb-1">3. Manage Classes / Batches</h2>
      <div class="flex gap-2">
        <input type="text" id="new-class-name" placeholder="e.g. S4 CSE A" class="flex-1 border p-2 rounded text-sm">
        <button onclick="addClass()" class="bg-emerald-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-emerald-700">Add Class</button>
      </div>
      <div id="class-list" class="mt-3 divide-y border rounded text-xs max-h-40 overflow-y-auto"></div>
    </div>

    <!-- 4. ADD STUDENTS (EXCEL TEMPLATE & UPLOAD) -->
    <div class="bg-white p-5 rounded-lg shadow border border-slate-200">
      <h2 class="text-base font-bold mb-3 border-b pb-1">4. Manage Students</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600">Select Target Class</label>
          <select id="student-class-sel" class="w-full border p-2 rounded text-sm mt-1" onchange="loadStudentsList()">
            <option value="">-- Choose Class --</option>
          </select>
        </div>

        <!-- EXCEL UPLOAD SECTION -->
        <div class="border border-blue-200 bg-blue-50/60 p-4 rounded-lg space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-blue-900">Import Via Excel</span>
            <button onclick="downloadExcelTemplate()" class="bg-white border border-blue-400 text-blue-700 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-100 flex items-center gap-1">
              <span>📥</span> Download Excel Template
            </button>
          </div>

          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">Choose Completed Excel File (.xlsx / .xls):</label>
            <input type="file" id="excel-file-input" accept=".xlsx, .xls" class="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer border rounded bg-white p-1">
          </div>

          <button onclick="uploadExcel()" id="btn-upload-excel" class="w-full bg-emerald-600 text-white py-2 rounded text-xs font-bold hover:bg-emerald-700">
            Upload & Save Students
          </button>
        </div>

        <!-- MANUAL ENTRY FALLBACK -->
        <details class="text-xs border rounded p-2">
          <summary class="cursor-pointer font-semibold text-slate-700">Manual Entry (Single Student)</summary>
          <div class="mt-3 space-y-2">
            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="block text-[11px] text-slate-500">Roll No</label>
                <input type="text" id="st-roll" placeholder="01" class="w-full border p-1.5 rounded text-xs">
              </div>
              <div class="col-span-2">
                <label class="block text-[11px] text-slate-500">Student Name</label>
                <input type="text" id="st-name" placeholder="John Doe" class="w-full border p-1.5 rounded text-xs">
              </div>
            </div>
            <button onclick="addSingleStudent()" class="bg-slate-700 text-white px-3 py-1.5 rounded text-xs font-bold">Add One</button>
          </div>
        </details>

        <!-- CURRENT CLASS ROSTER -->
        <div class="border-t pt-2">
          <div class="flex justify-between items-center mb-1">
            <h3 class="text-xs font-bold text-slate-700">Class Roster:</h3>
            <span id="roster-count" class="text-[11px] text-slate-500">0 students</span>
          </div>
          <div id="roster-list" class="divide-y border rounded text-xs max-h-48 overflow-y-auto bg-slate-50"></div>
        </div>

      </div>
    </div>
  </div>

  <script>
    const SUPABASE_URL = "https://kpbyxgdgbizeipsacbqd.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYnl4Z2RnYml6ZWlwc2FjYnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4OTgzNDksImV4cCI6MjEwNzQ3NDM0OX0.KgP4VSfPVpdxN4RsBScUC0IfxxTFtY5anKbB-OCG21s";
    const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    document.addEventListener("DOMContentLoaded", async () => {
      await loadSettings();
      await refreshClasses();
    });

    async function loadSettings() {
      const { data } = await db.from("institution_settings").select("*").eq("id", 1).single();
      if (data) {
        document.getElementById("cfg-college").value = data.college_name || "";
        document.getElementById("cfg-dept").value = data.department_name || "";
      }
    }

    async function saveSettings() {
      const col = document.getElementById("cfg-college").value.trim();
      const dep = document.getElementById("cfg-dept").value.trim();
      const btn = document.getElementById("btn-save-cfg");

      btn.textContent = "Saving...";
      await db.from("institution_settings").update({
        college_name: col,
        department_name: dep
      }).eq("id", 1);
      btn.textContent = "Saved!";
      setTimeout(() => btn.textContent = "Save Header Info", 2000);
    }

    async function createStaffAccount() {
      const name = document.getElementById("staff-name").value.trim();
      const email = document.getElementById("staff-email").value.trim();
      const password = document.getElementById("staff-pass").value;
      const role = document.getElementById("staff-role").value;
      const btn = document.getElementById("btn-create-staff");

      if (!name || !email || !password) return alert("Please fill all staff details");
      if (password.length < 6) return alert("Password must be at least 6 characters");

      btn.disabled = true;
      btn.textContent = "Creating...";

      const { data, error } = await db.auth.signUp({
        email,
        password,
        options: {
          data: { name, role }
        }
      });

      if (error) {
        alert("Failed to create account: " + error.message);
      } else {
        alert(`Account created successfully for ${name} (${role})!`);
        document.getElementById("staff-name").value = "";
        document.getElementById("staff-email").value = "";
        document.getElementById("staff-pass").value = "";
      }
      btn.disabled = false;
      btn.textContent = "Create Staff Account";
    }

    async function refreshClasses() {
      const { data } = await db.from("classes").select("*").order("name");
      const list = document.getElementById("class-list");
      const sel = document.getElementById("student-class-sel");

      list.innerHTML = "";
      sel.innerHTML = '<option value="">-- Choose Class --</option>';

      (data || []).forEach(c => {
        list.innerHTML += `<div class="p-2 flex justify-between"><span>${c.name}</span><span class="text-slate-400">ID: ${c.id}</span></div>`;
        sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
      });
    }

    async function addClass() {
      const name = document.getElementById("new-class-name").value.trim();
      if (!name) return alert("Enter class name");
      await db.from("classes").insert({ name });
      document.getElementById("new-class-name").value = "";
      await refreshClasses();
    }

    async function loadStudentsList() {
      const classId = document.getElementById("student-class-sel").value;
      const roster = document.getElementById("roster-list");
      const countLabel = document.getElementById("roster-count");

      if (!classId) {
        roster.innerHTML = "";
        countLabel.textContent = "0 students";
        return;
      }

      const { data } = await db.from("students").select("*").eq("class_id", classId).order("roll_no");
      if (!data || data.length === 0) {
        roster.innerHTML = '<div class="p-2 text-slate-400 text-center">No students added yet</div>';
        countLabel.textContent = "0 students";
        return;
      }

      countLabel.textContent = `${data.length} students`;
      roster.innerHTML = data.map(s => `
        <div class="p-2 flex justify-between">
          <span class="font-bold">${s.roll_no}</span>
          <span>${s.name}</span>
        </div>
      `).join("");
    }

    function downloadExcelTemplate() {
      const sampleData = [
        { "Roll No": "01", "Name": "Aravind Sharma" },
        { "Roll No": "02", "Name": "Diya Suresh" },
        { "Roll No": "03", "Name": "Mohammed Irfan" }
      ];

      const ws = XLSX.utils.json_to_sheet(sampleData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Students");
      XLSX.writeFile(wb, "Student_Upload_Template.xlsx");
    }

    async function uploadExcel() {
      const classId = document.getElementById("student-class-sel").value;
      const fileInput = document.getElementById("excel-file-input");

      if (!classId) return alert("Please select a target class first.");
      if (!fileInput.files || fileInput.files.length === 0) return alert("Please select an Excel file.");

      const file = fileInput.files[0];
      const reader = new FileReader();
      const btn = document.getElementById("btn-upload-excel");

      btn.disabled = true;
      btn.textContent = "Processing file...";

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);

          if (!jsonData || jsonData.length === 0) {
            alert("The uploaded Excel sheet is empty.");
            btn.disabled = false;
            btn.textContent = "Upload & Save Students";
            return;
          }

          const records = [];
          for (let row of jsonData) {
            const roll = row["Roll No"] || row["RollNo"] || row["ROLL NO"] || row["roll_no"] || row["Roll"];
            const name = row["Name"] || row["NAME"] || row["Student Name"] || row["student_name"];

            if (roll && name) {
              records.push({
                class_id: classId,
                roll_no: String(roll).trim(),
                name: String(name).trim()
              });
            }
          }

          if (records.length === 0) {
            alert("No valid records found. Make sure columns are titled 'Roll No' and 'Name'.");
            btn.disabled = false;
            btn.textContent = "Upload & Save Students";
            return;
          }

          btn.textContent = `Uploading ${records.length} students...`;

          const { error } = await db.from("students").upsert(records, { onConflict: 'class_id,roll_no' });

          if (error) {
            alert("Upload failed: " + error.message);
          } else {
            alert(`Success! Imported ${records.length} students.`);
            fileInput.value = "";
            await loadStudentsList();
          }
        } catch (err) {
          alert("Error parsing Excel file: " + err.message);
        } finally {
          btn.disabled = false;
          btn.textContent = "Upload & Save Students";
        }
      };

      reader.readAsArrayBuffer(file);
    }

    async function addSingleStudent() {
      const classId = document.getElementById("student-class-sel").value;
      const roll = document.getElementById("st-roll").value.trim();
      const name = document.getElementById("st-name").value.trim();

      if (!classId || !roll || !name) return alert("Fill Class, Roll No, and Name");

      const { error } = await db.from("students").upsert({ class_id: classId, roll_no: roll, name }, { onConflict: 'class_id,roll_no' });
      if (error) alert(error.message);
      else {
        document.getElementById("st-roll").value = "";
        document.getElementById("st-name").value = "";
        loadStudentsList();
      }
    }
  </script>
</body>
</html>
