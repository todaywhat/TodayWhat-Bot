import fs from "fs";

/**
 * JSON 파일에서 데이터를 읽어오는 함수
 * @param filename 읽을 JSON 파일의 이름
 * @param key 읽어올 데이터의 키 (옵션)
 * @returns 읽어온 데이터 또는 null
 */
export function readJsonFile<T = any>(filename: string, key?: string): T | null {
  try {
    const rawData = fs.readFileSync(filename, "utf8");
    const jsonData: T = JSON.parse(rawData);

    if (key && typeof jsonData === "object" && jsonData !== null && key in jsonData) {
      return (jsonData as any)[key];
    }

    return key ? null : jsonData;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.error(`File not found: ${filename}`);
    } else {
      console.error("Error reading JSON file:", error);
    }
    return null;
  }
}

/**
 * JSON 파일에 키-값 쌍으로 데이터를 쓰는 함수
 * @param filename 쓸 JSON 파일의 이름
 * @param key 저장할 데이터의 키
 * @param value 저장할 데이터의 값
 */
export function writeJsonKeyValue(filename: string, key: string, value: any): void {
  try {
    let jsonData: { [key: string]: any } = {};

    // 파일이 이미 존재하면 읽어옴
    if (fs.existsSync(filename)) {
      const rawData = fs.readFileSync(filename, "utf8");
      jsonData = JSON.parse(rawData);
    }

    // 새 데이터 추가 또는 업데이트
    jsonData[key] = value;

    // 파일에 쓰기
    fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2));
    console.log(`Data successfully written to ${filename} ${key} = ${value}`);
  } catch (error) {
    console.error("Error writing JSON file:", error);
  }
}

/**
 * JSON 파일에 전체 객체를 쓰는 함수
 * @param filename 쓸 JSON 파일의 이름
 * @param object 저장할 데이터 객체
 */
export function writeJsonObject(filename: string, object: object): void {
  try {
    // 파일에 쓰기
    fs.writeFileSync(filename, JSON.stringify(object, null, 2));
    console.log(`Object successfully written to ${filename}`);
  } catch (error) {
    console.error("Error writing JSON file:", error);
  }
}
