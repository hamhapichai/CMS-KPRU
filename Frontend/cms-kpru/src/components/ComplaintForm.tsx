"use client";
import { useState } from "react";
function ComplaintForm() {
  const [form, setForm] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    subject: "",
    message: "",
    isAnonymous: false,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const formData = new FormData();
      
      // เพิ่มข้อมูลฟอร์มลงใน FormData
      if (!form.isAnonymous) {
        formData.append("contactName", form.contactName);
        formData.append("contactEmail", form.contactEmail);
        formData.append("contactPhone", form.contactPhone);
      }
      formData.append("subject", form.subject);
      formData.append("message", form.message);
      formData.append("isAnonymous", form.isAnonymous.toString());
      
      // เพิ่มไฟล์แนบ
      files.forEach((file) => {
        formData.append("attachments", file);
      });

      const res = await fetch("/api/complaints", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "ส่งเรื่องไม่สำเร็จ");
      }

      setSuccess(true);
      setForm({ 
        contactName: "", 
        contactEmail: "", 
        contactPhone: "", 
        subject: "", 
        message: "", 
        isAnonymous: false 
      });
      setFiles([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 px-2 py-8">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-extrabold mb-4 text-blue-700 text-center">ระบบสายตรงคณบดี มีวัตถุประสงค์เพื่อ</h2>
          <ul className="mb-4 text-gray-700 text-base list-decimal pl-6">
            <li>รับข้อเสนอความคิดเห็นในการพัฒนา ปรับปรุงคณะ</li>
            <li>รับฟังเสียงสะท้อนหรือข้อร้องเรียนของผู้รับบริการ ผู้มาติดต่อ หรือผู้มีส่วนได้ส่วนเสียหรือสาธารณชน เช่น การทุจริตของเจ้าหน้าที่ในหน่วยงาน การจัดซื้อจัดจ้าง ความไม่เป็นธรรมในการให้บริการ การรับสินบน ความไม่โปร่งใสต่อการดำเนินการภายในองค์กร เป็นต้น</li>
          </ul>
          <p className="text-sm text-gray-500 mb-4">การร้องเรียนการทุจริตและประพฤติมิชอบของบุคลากรภายในหน่วยงาน ถือเป็นความลับทางราชการ มหาวิทยาลัยและผู้รับผิดชอบ จะปกปิดชื่อผู้ร้องเรียน และข้อมูลที่เกี่ยวข้องเป็นความลับ โดยคำนึงถึงความปลอดภัยและความเสียหายของทุกฝ่ายที่เกี่ยวข้อง</p>
        </div>
        <form className="bg-white rounded-2xl shadow-lg p-8" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-extrabold mb-8 text-center text-blue-700">แบบฟอร์มการติดต่อ</h2>
          {!form.isAnonymous && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">ชื่อผู้แจ้ง</label>
                <input type="text" name="contactName" value={form.contactName} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition shadow-sm" required />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">อีเมล</label>
                <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition shadow-sm" required />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">เบอร์โทร</label>
                <input type="text" name="contactPhone" value={form.contactPhone} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition shadow-sm" />
              </div>
            </div>
          )}
          <div className="mb-6 flex items-center">
            <input type="checkbox" name="isAnonymous" checked={form.isAnonymous} onChange={handleChange} className="mr-2 accent-blue-600" />
            <label className="font-semibold text-gray-700">แจ้งแบบไม่ระบุชื่อ</label>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">หัวข้อเรื่อง</label>
            <input type="text" name="subject" value={form.subject} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition shadow-sm" required />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">รายละเอียด</label>
            <textarea name="message" value={form.message} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition resize-y shadow-sm" rows={4} required />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">แนบไฟล์/รูปภาพ (ถ้ามี)</label>
            <input type="file" multiple accept="image/*,application/pdf" onChange={handleFileChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 shadow-sm" />
            {files.length > 0 && (
              <ul className="mt-2 space-y-2">
                {files.map((file, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-gray-100 rounded-xl px-3 py-2 text-base shadow-sm">
                    <span>{file.name}</span>
                    <button type="button" className="text-red-500 ml-2 font-bold" onClick={() => handleRemoveFile(idx)}>ลบ</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {error && <div className="text-red-500 mb-4 text-center font-semibold">{error}</div>}
          {success && <div className="text-green-600 mb-4 text-center font-semibold">ส่งเรื่องสำเร็จ!</div>}
          <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-400 text-white py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-green-500 transition font-extrabold text-lg" disabled={loading}>
            {loading ? "กำลังส่ง..." : "ส่งเรื่องร้องเรียน"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ComplaintForm;
