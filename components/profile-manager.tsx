'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Calendar,
  Lock,
  Save,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react'

export function ProfileManager() {
  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    location: '',
    examType: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        headers: getAuthHeaders()
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          bio: data.bio || '',
          location: data.location || '',
          examType: data.examType || ''
        })
      } else {
        console.error('Profile fetch failed:', response.status)
        const userData = localStorage.getItem('user')
        if (userData) {
          const user = JSON.parse(userData)
          setProfile(user)
          setFormData({
            name: user.name || '',
            phone: user.phone || '',
            bio: user.bio || '',
            location: user.location || '',
            examType: user.examType || ''
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        setProfile(user)
        setFormData({
          name: user.name || '',
          phone: user.phone || '',
          bio: user.bio || '',
          location: user.location || '',
          examType: user.examType || ''
        })
      }
    }
  }

  const updateProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        localStorage.setItem('user', JSON.stringify(updatedProfile))
        setIsEditing(false)
        setMessage('Profile updated successfully!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      setMessage('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setIsChangingPassword(false)
        setMessage('Password changed successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(result.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('Failed to change password:', error)
      setMessage('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const examTypes = [
    'UPSC', 'NEET_UG', 'IIT_JEE', 'CSIR_UGC_NET', 'NEET_PG', 'CODING', 'DSA', 'AI_ML'
  ]

  useEffect(() => {
    fetchProfile()
  }, [])

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg p-6 border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Profile Settings</h2>
            <p className="text-muted-foreground mt-1">Manage your personal information and account settings</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsEditing(!isEditing)} 
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
            <Button 
              onClick={() => setIsChangingPassword(!isChangingPassword)} 
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarFallback className="text-2xl">
                {profile?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold mb-2">{profile.name}</h3>
            <p className="text-muted-foreground mb-4">{profile.email}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{profile.examType?.replace('_', ' ') || 'Not specified'}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={profile?.email || ''}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="Enter your location"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Exam Type</label>
              <select
                value={formData.examType}
                onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="">Select exam type</option>
                {examTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Bio</label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <Button onClick={updateProfile} disabled={loading} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Password Change Modal */}
      {isChangingPassword && (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="pl-10 pr-10"
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="pl-10 pr-10"
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="pl-10 pr-10"
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={changePassword} disabled={loading} className="flex-1">
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
              <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}