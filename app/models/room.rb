class Room < ApplicationRecord
  validates :title, presence: true
end
