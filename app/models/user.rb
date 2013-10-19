class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  has_many :annotations
  has_many :videos, through: :annotations

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

  def self.find_or_create_omniauth(omniauth_hash)
    user = self.find_by provider: omniauth_hash.provider, uid: omniauth_hash.uid
    if user.present?
      user
    else
      self.omniauth_user_creation(omniauth_hash)
    end
  end

  def self.omniauth_user_creation(omniauth_hash)
    new_user = self.new do |user|

      if omniauth_hash.extra.raw_info.username.present? #facebook
        user.username = omniauth_hash.extra.raw_info.username
      elsif omniauth_hash.extra.raw_info.login.present? #github
        user.username = omniauth_hash.extra.raw_info.login
      elsif omniauth_hash.extra.raw_info.screen_name.present? #twitter
        user.username = omniauth_hash.extra.raw_info.screen_name
      end
        
      user.avatar_text = User.generate_new_avatar_text(user.username)
      user.provider = omniauth_hash.provider
      user.uid = omniauth_hash.uid
      user.email = omniauth_hash.info.email.present? ? omniauth_hash.info.email : ""

    end
    new_user.save
    new_user
  end

end
