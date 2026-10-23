-- ==============================================================================
-- CINEEVENT DATABASE ENCODING REPAIR SCRIPT
-- Sửa lỗi hiển thị font chữ tiếng Việt (Mojibake UTF-8)
-- ==============================================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
USE cineevent_db;

-- 1. Sửa bảng Roles
UPDATE roles SET description = 'Quản trị viên toàn quyền hệ thống' WHERE id = 1;
UPDATE roles SET description = 'Quản lý rạp, lịch chiếu, sự kiện và doanh thu' WHERE id = 2;
UPDATE roles SET description = 'Nhân viên bán vé và soát vé tại quầy' WHERE id = 3;
UPDATE roles SET description = 'Khách hàng sử dụng dịch vụ đặt vé' WHERE id = 4;

-- 2. Sửa bảng Permissions
UPDATE permissions SET name = 'Quản lý người dùng' WHERE id = 1;
UPDATE permissions SET name = 'Xem báo cáo doanh thu' WHERE id = 2;
UPDATE permissions SET name = 'Quản lý phim' WHERE id = 3;
UPDATE permissions SET name = 'Quản lý lịch chiếu' WHERE id = 4;
UPDATE permissions SET name = 'Quản lý sự kiện' WHERE id = 5;
UPDATE permissions SET name = 'Soát vé và kiểm tra mã vé' WHERE id = 6;
UPDATE permissions SET name = 'Đặt vé trực tuyến' WHERE id = 7;

-- 3. Sửa bảng Users
UPDATE users SET full_name = 'Hệ Thống Quản Trị Viên' WHERE id = 1;
UPDATE users SET full_name = 'Trần Minh Quản Lý' WHERE id = 2;
UPDATE users SET full_name = 'Lê Thị Thu Ngân Viên' WHERE id = 3;
UPDATE users SET full_name = 'Nguyễn Văn An (Khách Hàng)' WHERE id = 4;
UPDATE users SET full_name = 'Hoàng Thùy Linh (Khách Hàng)' WHERE id = 5;

-- 4. Sửa bảng Genres
UPDATE genres SET name = 'Hành Động & Phiêu Lưu' WHERE id = 1;
UPDATE genres SET name = 'Khoa Học Viễn Tưởng' WHERE id = 2;
UPDATE genres SET name = 'Tâm Lý & Tình Cảm' WHERE id = 3;
UPDATE genres SET name = 'Hoạt Hình & Gia Đình' WHERE id = 4;
UPDATE genres SET name = 'Kinh Dị & Giật Gân' WHERE id = 5;
UPDATE genres SET name = 'Hài Hước & Đời Sống' WHERE id = 6;

-- 5. Sửa bảng Movies
UPDATE movies SET 
  title = 'Dune: Hành Tinh Cát - Phần 2',
  director = 'Denis Villeneuve',
  cast = 'Timothée Chalamet, Zendaya, Rebecca Ferguson',
  description = 'Paul Atreides hợp lực cùng Chani và người Fremen để trả thù những kẻ hủy hoại gia đình mình, đối mặt với sự lựa chọn giữa tình yêu và số phận vũ trụ.'
WHERE id = 1;

UPDATE movies SET 
  title = 'Mai — Bộ Phim Tâm Lý Đỉnh Cao',
  director = 'Trấn Thành',
  cast = 'Phương Anh Đào, Tuấn Trần, Hồng Đào',
  description = 'Câu chuyện xúc động về Mai, người phụ nữ gần 40 tuổi làm nghề massage trị liệu, chịu định kiến xã hội và gặp gỡ chàng trai đào hoa Dương.'
WHERE id = 2;

UPDATE movies SET 
  title = 'Kung Fu Panda 4',
  director = 'Mike Mitchell',
  cast = 'Jack Black, Awkwafina, Viola Davis',
  description = 'Po được chọn làm Thủ lĩnh tinh thần của Thung lũng Bình Yên nhưng phải đối đầu với Tắc Kè Bông - kẻ có khả năng biến hình thành mọi kẻ thù trong quá khứ.'
WHERE id = 3;

UPDATE movies SET 
  title = 'Godzilla x Kong: Đế Chế Mới',
  director = 'Adam Wingard',
  cast = 'Rebecca Hall, Brian Tyree Henry, Dan Stevens',
  description = 'Godzilla và Kong phải gạt bỏ hiềm khích để cùng chiến đấu chống lại một mối đe dọa khổng lồ chưa từng thấy ẩn sâu trong Trái Đất Rỗng.'
WHERE id = 4;

UPDATE movies SET 
  title = 'Lật Mặt 7: Một Điều Ước',
  director = 'Lý Hải',
  cast = 'Thanh Hiền, Trương Minh Cường, Đinh Y Nhung',
  description = 'Câu chuyện cảm động về người mẹ 73 tuổi một mình nuôi 5 đứa con khôn lớn. Khi bà gặp nạn, các con trưởng thành phải xoay xở nghĩa vụ phụng dưỡng.'
WHERE id = 5;

UPDATE movies SET 
  title = 'Deadpool & Wolverine',
  director = 'Shawn Levy',
  cast = 'Ryan Reynolds, Hugh Jackman, Emma Corrin',
  description = 'Wade Wilson bị cơ quan TVA lôi kéo vào nhiệm vụ giải cứu đa vũ trụ và bắt tay cùng người sói Wolverine cộc cằn.'
WHERE id = 6;

-- 6. Sửa bảng Events
UPDATE events SET 
  title = 'Đại Nhạc Hội Monsoon Music Festival 2026',
  category = 'Đại Nhạc Hội EDM & Rock',
  organizer = 'Monsoon Production & CineEvent',
  venue_name = 'Trung Tâm Hội Nghị Quốc Gia',
  venue_address = 'Đại lộ Thăng Long, Mễ Trì, Nam Từ Liêm, Hà Nội',
  description = 'Lễ hội âm nhạc quốc tế đỉnh cao quy tụ dàn nghệ sĩ hàng đầu Việt Nam và Quốc Tế cùng hệ thống âm thanh ánh sáng chuẩn festival toàn cầu.'
WHERE id = 1;

UPDATE events SET 
  title = 'Hòa Nhạc Giao Hưởng Live in Saigon',
  category = 'Nhạc Cổ Điển & Symphony',
  organizer = 'Dàn Nhạc Giao Hưởng Quốc Gia',
  venue_name = 'Nhà Hát Hòa Bình',
  venue_address = '240 đường 3 Tháng 2, Phường 12, Quận 10, TP.HCM',
  description = 'Thưởng thức những tác phẩm kinh điển của Beethoven, Mozart và Tchaikovsky qua màn biểu diễn xuất chúng của 80 nghệ sĩ giao hưởng tài hoa.'
WHERE id = 2;

UPDATE events SET 
  title = 'Vietnam GameVerse Esports Championship 2026',
  category = 'Thể Thao Điện Tử & Triển Lãm',
  organizer = 'Hiệp Hội Thể Thao Điện Tử & Giải Trí',
  venue_name = 'Sân Vận Động Quân Khu 7',
  venue_address = '202 Hoàng Văn Thụ, Phường 9, Phú Nhuận, TP.HCM',
  description = 'Ngày hội game lớn nhất Việt Nam với chung kết tổng giải đấu LMHT, Tốc Chiến, cosplay contest và khu trải nghiệm công nghệ thực tế ảo VR đỉnh cao.'
WHERE id = 3;

-- 7. Sửa bảng Ticket Types
UPDATE ticket_types SET name = 'Vé GA (Standard Sân Cỏ)', description = 'Khu vực đứng sân cỏ trung tâm, hòa mình vào không khí cuồng nhiệt' WHERE id = 1;
UPDATE ticket_types SET name = 'Vé VIP Khán Đài A', description = 'Chỗ ngồi khán đài có mái che, tặng kèm 01 đồ uống và áo lưu niệm' WHERE id = 2;
UPDATE ticket_types SET name = 'Vé VVIP Lounge & Backstage', description = 'Lounge riêng biệt có phục vụ đồ ăn nhẹ, lối đi riêng và gặp gỡ nghệ sĩ' WHERE id = 3;
UPDATE ticket_types SET name = 'Vé Tầng 2 (Standard)', description = 'Khu vực khán phòng lầu 2, tầm nhìn toàn cảnh sân khấu hòa nhạc' WHERE id = 4;
UPDATE ticket_types SET name = 'Vé Hạng Nhất (VIP Tầng 1)', description = 'Ghế êm ái hàng đầu tầng 1, trải nghiệm âm thanh mộc acoustic tuyệt vời' WHERE id = 5;
UPDATE ticket_types SET name = 'Vé Khán Giả GameVerse Pass', description = 'Vào cổng trọn ngày, tham quan gian hàng và theo dõi thi đấu esport' WHERE id = 6;

-- 8. Sửa bảng Cinemas & Venues
UPDATE cinemas SET name = 'CineEvent Cinema Landmark 81', city = 'TP. Hồ Chí Minh', address = 'Tầng B1, TTTM Vincom Center Landmark 81, Bình Thạnh' WHERE id = 1;
UPDATE cinemas SET name = 'CineEvent Cinema Vincom Bà Triệu', city = 'Hà Nội', address = 'Tầng 6, TTTM Vincom Center, 191 Bà Triệu, Hai Bà Trưng' WHERE id = 2;

UPDATE venues SET name = 'Trung Tâm Hội Nghị Quốc Gia', city = 'Hà Nội', address = 'Đại lộ Thăng Long, Nam Từ Liêm' WHERE id = 1;
UPDATE venues SET name = 'Nhà Hát Hòa Bình', city = 'TP. Hồ Chí Minh', address = '240 đường 3 Tháng 2, Quận 10' WHERE id = 2;
UPDATE venues SET name = 'Sân Vận Động Quân Khu 7', city = 'TP. Hồ Chí Minh', address = '202 Hoàng Văn Thụ, Phú Nhuận' WHERE id = 3;

-- 9. Sửa bảng Rooms
UPDATE rooms SET name = 'Phòng Chiếu 01 (IMAX Laser)' WHERE id = 1;
UPDATE rooms SET name = 'Phòng Chiếu 02 (Gold Class VIP)' WHERE id = 2;
UPDATE rooms SET name = 'Phòng Chiếu 03 (Standard Dolby Atmos)' WHERE id = 3;
UPDATE rooms SET name = 'Phòng Chiếu 01 (IMAX Laser)' WHERE id = 4;
UPDATE rooms SET name = 'Phòng Chiếu 02 (Standard)' WHERE id = 5;

-- 10. Sửa bảng FnB
UPDATE fnb_items SET name = 'Bắp Rang Bơ Phô Mai Lớn', description = 'Bắp rang bơ giòn rụm phủ phô mai Cheddar hảo hạng' WHERE id = 1;
UPDATE fnb_items SET name = 'Bắp Rang Ngọt Caramel', description = 'Bắp rang đường caramel thơm lừng kiểu truyền thống' WHERE id = 2;
UPDATE fnb_items SET name = 'Combo 1 Bắp 2 Nước Ngọt', description = '01 Bắp rang bơ lớn + 02 ly nước ngọt có ga tùy chọn' WHERE id = 3;
UPDATE fnb_items SET name = 'Nước Ngọt Có Ga Lớn', description = 'Coca-Cola / Pepsi / Sprite ly 32oz ướp lạnh' WHERE id = 4;
UPDATE fnb_items SET name = 'Snack Khoai Tây Chiên', description = 'Khoai tây chiên vị tảo biển / BBQ' WHERE id = 5;
