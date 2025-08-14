import 'package:flutter/material.dart';

class AccountPage extends StatefulWidget {
  const AccountPage({Key? key}) : super(key: key);

  @override
  State<AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('บัญชีผู้ใช้'),
        backgroundColor: Colors.blueAccent, // เพิ่มสีสันให้ AppBar
      ),
      body: ListView( // ใช้ ListView เพื่อให้เนื้อหาเลื่อนได้ถ้ามีรายการเยอะ
        children: <Widget>[
          const SizedBox(height: 30), // เพิ่มระยะห่างจากขอบบน
          // === ส่วนโปรไฟล์ ===
          const CircleAvatar(
            radius: 50,
            backgroundColor: Colors.grey,
            // หากมี URL รูปภาพ สามารถใช้ backgroundImage: NetworkImage('URL_ของรูปภาพ'),
            child: Icon(
              Icons.person,
              size: 50,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 10),
          const Center(
            child: Text(
              'ชื่อผู้ใช้งาน',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 5),
          const Center(
            child: Text(
              'email@example.com',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),