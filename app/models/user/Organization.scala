package models.user

import java.sql.Timestamp

import db.Model
import db.impl.access.UserBase
import db.impl.{OreModel, OrganizationMembersTable, OrganizationRoleTable, UserTable}
import db.meta.Bind
import db.meta.relation.{ManyToMany, ManyToManyCollection, OneToMany}
import models.project.Project
import models.user.role.OrganizationRole
import ore.organization.OrganizationMember
import ore.permission.scope.{GlobalScope, Scope, ScopeSubject}
import ore.user.UserOwned

import scala.annotation.meta.field

/**
  * Represents an Ore Organization. An organization is like a [[User]] in the
  * sense that it shares many qualities with Users and also has a companion
  * User on the forums. An organization is made up by a group of Users who each
  * have a corresponding rank within the organization.
  *
  * @param id             Unique ID
  * @param createdAt      Date of creation
  * @param password       Sponge forums password (encrypted)
  * @param ownerId        The ID of the [[User]] that owns this organization
  */
@OneToMany(Array(classOf[Project], classOf[OrganizationRole]))
@ManyToManyCollection(Array(new ManyToMany(modelClass = classOf[User], tableClass = classOf[OrganizationMembersTable])))
case class Organization(override val id: Option[Int] = None,
                        override val createdAt: Option[Timestamp] = None,
                        @(Bind @field) username: String,
                        @(Bind @field) password: String,
                        @(Bind @field) ownerId: Int)
                        extends OreModel(id, createdAt)
                          with UserOwned
                          with ScopeSubject {

  /**
    * Returns the [[User]] that owns this Organization.
    *
    * @return User that owns organization
    */
  def owner: User = this.userBase.get(this.ownerId).get

  /**
    * Returns all [[OrganizationMember]]s of this Organization.
    *
    * @return All OrganizationMembers
    */
  def members = {
    this.manyToMany[OrganizationMembersTable, UserTable, User](classOf[User]).all
      .map(user => new OrganizationMember(this, user.id.get))
  }

  /**
    * Returns all [[OrganizationRole]]s of this Organization.
    *
    * @return All OrganizationRoles
    */
  def roles = this.oneToMany[OrganizationRoleTable, OrganizationRole](classOf[OrganizationRole])

  /**
    * Returns this Organization as a [[User]].
    *
    * @return This Organization as a User
    */
  def toUser = this.service.access(classOf[UserBase]).withName(this.username).get

  override val userId: Int = this.ownerId
  override val scope: Scope = GlobalScope
  override def copyWith(id: Option[Int], theTime: Option[Timestamp]): Model = this.copy(createdAt = theTime)

}