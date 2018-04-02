package ore.project

import db.impl.OrePostgresDriver
import db.table.MappedType
import slick.jdbc.JdbcType

/**
  * Enumeration of Categories a Project may possess.
  */
object Categories extends Enumeration {

  val AdminTools  =   Category( 0, "Admin Tools",       "fas fa-server")
  val Chat        =   Category( 1, "Chat",              "fas fa-comment")
  val DevTools    =   Category( 2, "Developer Tools",   "fas fa-wrench")
  val Econ        =   Category( 3, "Economy",           "far fa-money-bill-alt")
  val Gameplay    =   Category( 4, "Gameplay",          "fas fa-puzzle-piece")
  val Games       =   Category( 5, "Games",             "fas fa-gamepad")
  val Protect     =   Category( 6, "Protection",        "fas fa-lock")
  val Rp          =   Category( 7, "Role Playing",      "fas fa-magic")
  val WorldMgmt   =   Category( 8, "World Management",  "fas fa-globe")
  val Misc        =   Category( 9, "Miscellaneous",     "fas fa-asterisk")
  val Undefined   =   Category(10, "Undefined",         null, isVisible = false)

  /**
    * Returns the visible Categories.
    *
    * @return Visible categories
    */
  def visible: Seq[Category] = this.values.filter(_.isVisible).toSeq.sortBy(_.id).map(_.asInstanceOf[Category])

  /**
    * Returns an Array of categories from a comma separated string of IDs.
    *
    * @param str  Comma separated string of IDs
    * @return     Array of Categories
    */
  def fromString(str: String): Array[Category] = (for (idStr <- str.split(",")) yield {
    var id: Int = -1
    try {
      id = Integer.parseInt(idStr)
    } catch {
      case nfe: NumberFormatException => ;
      case e: Exception => throw e
    }
    if (id >= 0 && id < Categories.values.size) {
      Some(Categories(id).asInstanceOf[Category])
    } else {
      None
    }
  }).flatten

  /**
    * Represents a Project category.
    *
    * @param i      Index
    * @param title  Title to display
    * @param icon   Icon to display
    */
  case class Category(i: Int, title: String, icon: String, isVisible: Boolean = true)
    extends super.Val(i, title)
      with MappedType[Category] {
    implicit val mapper: JdbcType[Category] = OrePostgresDriver.api.categoryTypeMapper

    def createCategoryToggledQueryString(categoryList: Option[Seq[Category]]) : String = {
      categoryList.map { seq =>
        val newSeq = if(seq.contains(this)) seq.toSet - this else seq.toSet + this

        if(Categories.visible.toSet.equals(newSeq)) "" else newSeq.map(_.i).mkString(",")
      }.getOrElse(this.i.toString)
    }
  }

  implicit def convert(value: Value): Category = value.asInstanceOf[Category]

}
