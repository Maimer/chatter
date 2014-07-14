class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable,
         :registerable,
         :rememberable,
         :trackable,
         :validatable

  validates :handle, presence: true,
            format: { with: /\A[\w]+\z/ },
            length: { minimum: 4, maximum: 12 },
            exclusion: { in: %w(Admin Server HAL9000) }

  validates_uniqueness_of :handle, case_sensitive: false
end
