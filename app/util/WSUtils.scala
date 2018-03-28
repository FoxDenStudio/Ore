package util

import java.net.{URI, URISyntaxException}

import play.api.Logger
import play.api.libs.json.JsValue
import play.api.libs.ws.WSResponse

import scala.util.{Failure, Success, Try}

object WSUtils {

  def parseJson(response: WSResponse, log: Logger): Option[JsValue] = {
    if (response.status < 200 || response.status >= 300)
      return None
    Try(response.json) match {
      case Failure(e) =>
        log.warn("Failed to parse response as JSON", e)
        None
      case Success(json) =>
        log.info("Response: " + json)
        Some(json)
    }
  }

  @throws(classOf[URISyntaxException])
  def appendUri(uri: String, appendQuery: String) : URI = {
    val oldUri = new URI(uri)
    var newQuery = oldUri.getQuery

    if (newQuery == null) {
      newQuery = appendQuery
    } else {
      newQuery += "&" + appendQuery
    }

    new URI(oldUri.getScheme, oldUri.getAuthority, oldUri.getPath, newQuery, oldUri.getFragment)
  }

}
