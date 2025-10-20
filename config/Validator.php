<?php
class Validator {
  public static function sanitize($value) {
    return htmlspecialchars(strip_tags(trim($value)));
  }

  public static function requireFields($data, $fields) {
    foreach ($fields as $field) {
      if (empty($data[$field])) {
        Response::error("Field '$field' is required");
      }
    }
  }
}
?>
