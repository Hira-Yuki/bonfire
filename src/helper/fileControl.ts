export const fileSizeChecker = (file: File) => {
  if (file.size > 1048576) {
    alert("파일 크기가 1MB를 초과합니다. 다른 파일을 선택해 주세요.");
    return true;
  }
  return false;
};
