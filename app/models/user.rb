class User < ActiveRecord::Base
  has_one :profile
  has_one :team
end
