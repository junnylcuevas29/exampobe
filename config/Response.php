<?php
class Response {
  public static function success($data = [], $status = 200) {
    http_response_code($status);
    echo json_encode(['success' => true, 'data' => $data]);
    exit;
  }

  public static function error($message = 'An error occurred', $status = 400) {
    http_response_code($status);
    echo json_encode(['success' => false, 'error' => $message]);
    exit;
  }
}
?>
