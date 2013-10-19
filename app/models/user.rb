class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates :username, :avatar_text, :presence => true
  validates :username, :uniqueness => true

  def email_required?
    false
  end

  def password_required?
    false
  end

  def self.generate_new_avatar_text(username)
  	username + Devise.friendly_token[0,10].to_s
  end

end
