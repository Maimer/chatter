class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates :handle, presence: true, uniqueness: true,
            format: { with: /\A[\w]+\z/ }, length: { minimum: 4, maximum: 12 },
            exclusion: { in: %w(Admin Server) }
end
