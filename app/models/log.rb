class Log < ActiveRecord::Base
  belongs_to :connection
  has_many :comments
end
