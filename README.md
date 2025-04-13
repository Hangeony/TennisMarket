## 💡 개발 중 발생한 문제 및 해결 과정

### 🧩 문제 상황

`orderlist` 테이블에 `productId`, `orderDate`만 저장하고 있었지만, 실제로는 **상품명, 설명, 가격도 함께 저장**해서 주문 상세에 바로 보여주고 싶었음.

이를 위해 테이블 구조를 변경하지 않고는 원하는 데이터를 저장할 수 없었고,
기존 데이터를 유지하면서 컬럼 추가, 삭제, 데이터 타입 변경 등의 테이블 구조 수정이 가능한
**DDL(Data Definition Language)**의 개념과 사용법을 학습하게 되었다.


![readme](https://github.com/user-attachments/assets/e9400c10-6547-4e8d-ade2-9c066523b42e)

---

### 🛠 테이블 구조 변경 (DDL 사용)

```sql
ALTER TABLE orderlist
ADD COLUMN name VARCHAR(30),
ADD COLUMN description VARCHAR(100),
ADD COLUMN price INT;
```

- 기존 데이터는 그대로 유지하면서 새로운 컬럼만 추가
- `ALTER TABLE`을 통해 동적인 스키마 변경 가능

![DDL전](https://github.com/user-attachments/assets/2f6bda9a-54e5-4dda-a012-559c59106af1)
![DDL 후](https://github.com/user-attachments/assets/90ed0e1c-308d-4f35-8c64-ed4af5bc2af0)
---




### ❌ 나의 실수
```
if (productId == '1') {
  mariadb.query("INSERT INTO orderlist VALUES (" + productId + ", '" + orderDate + "', 'Red Racket', 'Hot Red!', + '30000');",
}
```

### 문제 요약

- `mariadb.query()` 괄호가 제대로 닫히지 않음
- 콜백 함수가 `if/else` 문 블록 바깥에 있어 실행되지 않음
- 문자열 연결 시 따옴표(`'`)가 누락되거나 잘못 연결됨
- 직접 문자열 붙이기로 SQL 인젝션 위험 존재

---

### 해결 방법

1. 테이블 구조 분석 → `ALTER TABLE`로 필요한 컬럼 추가
2. SQL 쿼리에 placeholder(`?`) 적용 → 가독성 + 보안 향상
3. 콜백 함수 위치 수정 → 쿼리 결과 정상 출력

```
const orderDate = new Date().toLocaleDateString();
let name, description, price;

if (productId == '1') {
    name = 'Red Racket';
    description = 'Hot Red!';
    price = 30000;
} else if (productId == '2') {
    name = 'Blue Racket';
    description = 'Cool Blue';
    price = 35000;
} else {
    name = 'Black Racket';
    description = 'Dark Black';
    price = 50000;
}

const sql = "INSERT INTO orderlist (productId, orderDate, name, description, price) VALUES (?, ?, ?, ?, ?)";
const values = [productId, orderDate, name, description, price];

mariadb.query(sql, values, function(err, rows) {
    console.log(`Insert ${rows}`);
    console.log(`err ${err}`);
});
```
### 🔧 주요 개선 포인트
| Before (문제) | After (해결) |
| --- | --- |
| 문자열 직접 연결 | placeholder(`?`) 사용 |
| 따옴표/구문 오류 | 깔끔한 SQL 구성 |
| 콜백 위치 오류 | `query()` 내부에 포함 |
| SQL 인젝션 가능성 | 안전한 바인딩 방식 사용 |

### 📌 느낀 점
- 단순한 insert도 **구조를 이해하지 않고 작성하면 큰 에러를 만든다**
- 실무에서 중요한 건 동작하는 코드가 아니라 **안전하고 확장 가능한 코드**
- SQL 쿼리문은 **가독성 + 보안**을 동시에 신경 써야 한다
- `ALTER TABLE`은 테이블 재설계 없이 구조 확장할 수 있는 강력한 도구임

