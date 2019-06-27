class Message < ApplicationRecord
  validates :user, presence: true
  validates :text, presence: true

  belongs_to :room
end
